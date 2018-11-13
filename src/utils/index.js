export function emit(Class) {
  Object.assign(Class.prototype, {
    emit(eventName, data) {
      let event = new CustomEvent(eventName)
      event = Object.assign(event, data)
      this.dispatchEvent(event)
    }
  })
}
export function input(property, klass) {
  const prop = Symbol.for(property)
  return function define(Class) {
    Object.defineProperty(Class.prototype, property, {
      configurable: true,
      get() {
        return this[prop]
      },
      set(value) {
        if(this[prop] !== value) this.render(this[prop] = value)
      },
    })
  }
}
