import { Component, Template } from '@scoutgg/widgets'
import { Route } from "widgets-router"

@Route("/create-event")
@Component('beer')
@Template(function (html) {
  html`
    <h1>New event</h1>
    <input placeholder="event name" onchange=${e => this.eventName = e.target.value} />
    <button onclick=${() => this.createEvent()}>create event</button>
  `
})
export default class CreateEvent extends HTMLElement {

  eventName = null


  createEvent() {
    console.log("created event", this.eventName)
  }
}
