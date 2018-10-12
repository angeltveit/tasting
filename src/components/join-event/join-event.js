import { Component, Template } from '@scoutgg/widgets'
import { Route } from "widgets-router"
import { joinEvent } from "../../services/events"


@Route("/join-event")
@Component('beer')
@Template(function (html) {
  html`
    <h1>Join event</h1>
    <input placeholder="event pin" onchange=${e => this.eventPin = e.target.value} />
    <beer-button onclick=${() => this.joinEvent()}>create event</beer-button>
  `
})
export default class JoinEvent extends HTMLElement {
  eventPin = null

  joinEvent() {
    const result = joinEvent(this.eventPin)
    console.log("joining event", this.eventPin, result)
  }
}
