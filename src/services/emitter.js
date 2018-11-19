export default {
  on(event, callback) {
    document.addEventListener(event, callback)
  },
  emit(event, data={}) {
    let customEvent = new CustomEvent(event)
    customEvent = Object.assign(customEvent, data)
    document.dispatchEvent(customEvent)
  }
}
