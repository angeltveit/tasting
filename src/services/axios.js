import axios from "axios"
import { camelCase } from 'lodash'
import qs from 'query-string'
import pluralize from 'pluralize'


function handleHeaders() {

  const HEADERS = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Beerer " + localStorage.beerToken,
  }

  const headers = Object.assign({}, HEADERS, this._headers || {})
  Object.keys(headers).forEach(h => {
    if(!headers[h]) delete headers[h]
  })
  return headers
}

const instance = fetch

let ModelIdCount = 0

// Cache object
const MODELS = {}

export class Axios {

  constructor(data, options={}) {
    if(!data || data === 'undefined') return undefined
    if(['string', 'number'].includes(typeof data)) data = { id: +data }
    if(!data.id) {
      data.id = ModelIdCount -= 1
    }
    Object.assign(this, (this._defaults || {}), data)
    if(!MODELS[this.constructor.name]) MODELS[this.constructor.name] = {}
    if(MODELS[this.constructor.name][this.id] && !options.overwrite) return MODELS[this.constructor.name][this.id]
    MODELS[this.constructor.name][this.id] = this
  }

  // Load without instance calls list endpoint
  static load(path, params = {}) {
    const url = typeof path === 'string' ? '/'+path : ''
    const query = qs.stringify(typeof path === 'object' ? path : params)
    return fetch(`${this.endpoint}${url}?${query}`, {
      method: 'GET',
      headers: handleHeaders.bind(this)(),
    })
      .then(this.prototype.handleResponse.bind(this))
      .then( data => {

        const pluralized = pluralize(camelCase(this.name))
        let mapable = data[pluralized]

        /*if(!this._key) {
          mapable = data[pluralized][this._key]
        }*/
        data[pluralized] = mapable.map((obj) => {
          return new this(obj)
        })
        return data
      })
  }

  async load(params = {}) {
    // Check if we should return cached version
    if(
      (MODELS[this.constructor.name] && MODELS[this.constructor.name][this.id]) &&
      (Date.now() - MODELS[this.constructor.name][this.id].__version < 10*1000) &&
      !params.$reload
    ) {
      return Promise.resolve(MODELS[this.constructor.name][this.id])
    }
    const query = qs.stringify(params)
    // Load from server
    const data = await fetch(`${this.endpoint}/${this.id}?${query}`, {
      method: 'GET',
      headers: handleHeaders.bind(this)(),
    })
      .then(this.handleResponse)

    MODELS[this.constructor.name][this.id].__version = Date.now()
    Object.assign(this, (data[camelCase(this.constructor.name)] || {}))
    return data
  }

  async save(path, params = {}) {

    let method = 'POST'

    let endpoint = this.endpoint
    if(this.id > -1) {
      method = 'PATCH'
      endpoint += `/${this.id}`
    }

    const query = qs.stringify(typeof path === 'object' ? path : params)
    const url = typeof path === 'string' ? '/'+path : ''
    const data = await fetch(`${endpoint}${url}?${query}`, {
      method,
      headers: handleHeaders.bind(this)(),
      body: JSON.stringify(this),
    })
      .then(this.handleResponse)

    Object.assign(this, data[camelCase(this.constructor.name)])
    MODELS[this.constructor.name][this.id] = this
    MODELS[this.constructor.name][this.id].__version = Date.now()

    return data
  }

  toString() {
    return this.id
  }

  async handleResponse(response) {
    const contentType = response.headers.get("content-type")
    if(!contentType) return throw new Error('missing_content_type')
    if(!contentType?.includes("application/json")) {
      return throw new Error('wrong_content_type')
    }
    const data = await response.json()
    let level = data
    const key = this._key || pluralize(camelCase(this.name))
    if(key) {
      const layers = key.split('.')
      layers.forEach(layer => level = level[layer])
    }
    data[pluralize(camelCase(this.name))] = level
    return data
  }

  // For Widgets Attribute decorator
  static instance(data) {
    if(!data || data === 'undefined') return undefined
    return new this(data)
  }
}

export function endpoint(path) {
  return function(Class) {
    Class.prototype.endpoint = path
    Class.endpoint = path
  }
}
export function base(url) {
  return function(Class) {
    Class.prototype.endpoint = url + Class.prototype.endpoint
    Class.endpoint = url + Class.endpoint
  }
}
// Use @map if the endpoint has a iterable array inside the main key.
export function map(key) {
  return function(Class) {
    Class.prototype._key = key
    Class._key = key
  }
}
export function headers(headers) {
  return function(Class) {
    Class.prototype._headers = headers
    Class._headers = headers
  }
}
export function defaults(defaults) {
  return function(Class) {
    Class.prototype._defaults = defaults
  }
}
