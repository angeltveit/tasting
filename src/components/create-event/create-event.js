import { Component, Template } from '@scoutgg/widgets'
import { wire } from "hyperhtml"
import { Route } from "widgets-router"
import { createEvent } from "../../services/events"

@Route("/create-event")
@Component('beer')
@Template(function (html) {
  html`
    <h1>New event</h1>
    <input placeholder="event name" onchange=${e => this.eventName = e.target.value} />
    <beer-button onclick=${() => this.createEvent()}>create event</beer-button>

    ${this.eventCode && wire()`<div>Event kode: ${this.eventCode}</div>`}
  `
})
export default class CreateEvent extends HTMLElement {

  eventName = null

  async createEvent() {
    const eventResponse = await createEvent(this.eventName)
    this.eventCode = eventResponse.code
    this.render()
    console.log("created event", this.eventName, eventResponse)
  }
}
