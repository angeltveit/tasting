import { Component, Attribute, Template } from '@scoutgg/widgets'
import { wire } from "hyperhtml"
import { Route, router } from "widgets-router"
import { current } from '../../services/auth'

import Event from '../../models/event'

import '../../components/input/input'
import '../../components/button/button'
import '../../components/search-beers/search-beers'
import '../../components/selected-beers/selected-beers'

@Route('/create-event/:event?')
@Component('beer')
@Attribute('event', Event)
@Attribute('eventName', String, { default: 'My event' })
@Template(function (html) {
  html`
    <style>
      :host {
        display: block;
        padding: 0 1em;
        box-sizing: border-box;
      }
      .beer-selection {
        display: flex;
        justify-content: space-around;
      }
    </style>
    <h1>New event "${this.event && this.event.name || this.eventName}"</h1>
    <div class="label">Give your event a cool name:</div>
    <beer-input
      value=${this.event && this.event.name}
      placeholder="event name"
      onchanged=${e => this.event.name = e.value}
    ></beer-input>

    <beer-button onclick=${() => this.save()}>Save</beer-button>
    <beer-button onclick=${() => this.start()}>Start event</beer-button>
    ${this.event && this.event.code && wire()`
      <div>Event kode: ${this.event.code}</div>
      <div class="beer-selection">

        <untappd-search-beers
          onchanged=${({ beer }) => this.addBeer(beer)}
        ></untappd-search-beers>

        <beer-selected-beers
          onchanged=${({ beer })=> this.removeBeer(beer)}
        ></beer-selected-beers>
      </div>
    `}
  `
})
export default class CreateEvent extends HTMLElement {
  async connectedCallback() {
    if(!this.event) {
      this.event = new Event({})
    } else {
      await this.event.load()
      setTimeout(() => this.refreshSelected(), 500)
      this.render()
    }
  }
  addBeer(beer) {
    this.event.beers.push(beer)
    this.refreshSelected()
  }
  removeBeer(beer) {
    const index = this.event.beers.findIndex(b => b.uid === beer.uid)
    if(index >= 0) this.event.beers.splice(index, 1)
    this.refreshSelected()
  }
  refreshSelected() {
    const el = this.shadowRoot.querySelector('beer-selected-beers')
    if(el) {
      el.beers = this.event.beers
      el.render()
    }
  }
  async start() {
    await this.event.save('start')
    router(`/manage/${this.event.id}`)
  }
  async save(name) {
    const isNew = this.event.id < 0
    await this.event.save()
    if(isNew) return router(`/create-event/${this.event.id}`)
    setTimeout(() => this.refreshSelected())
    this.render()
  }
}
