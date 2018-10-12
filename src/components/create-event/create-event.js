import { Component, Template } from '@scoutgg/widgets'
import { Route } from "widgets-router"
import { createEvent } from "../../api"

@Route("/create-event")
@Component('beer')
@Template(function (html) {
  html`
    <h1>New event</h1>
    <input placeholder="event name" onchange=${e => this.eventName = e.target.value} />
    <beer-button onclick=${() => this.createEvent()}>create event</beer-button>
  `
})
export default class CreateEvent extends HTMLElement {

  eventName = null

  async createEvent() {
    const eventResponse = await createEvent(this.eventName)
    console.log("created event", this.eventName, eventResponse)
  }
}
