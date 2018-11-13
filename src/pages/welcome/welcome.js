import { Component, Template } from '@scoutgg/widgets'
import { current } from '../../services/auth'
import Event from '../../models/event'
import { wire } from 'hyperhtml'
import moment from 'moment'
import { Route, router } from 'widgets-router'

@Route('/welcome')
@Component('beer')
@Template(function (html) {
  html`
    <style>
      :host {
        text-align: center;
        display: block;
        margin-top: 2em;
      }
      h1 {
        font-weight: 500;
        font-family: var(--accent-font);
      }

      .actions {
        margin-bottom: 2em;
        display: flex;
        justify-content: space-around;
      }
      a {
        color: currentColor;
        display: block;
      }
    </style>

    <div class="actions">
      <beer-button onclick=${() => router("/create-event")}>
        create event
      </beer-button >
      <beer-button onclick=${() => router("/join-event")}>
        join event
      </beer-button>
    </div>
    <h1>Can haz cake?</h1>
    ${this.displayEvents}
  `
})
export default class Welcome extends HTMLElement {
  async connectedCallback() {
    const { events, active } = await Event.load()
    this.events = events
    this.render()
  }
  get user() {
    return current()
  }

  get displayEvents() {
    const active = (this.events || [])
      .filter(e => !e.ended_at)
      .map((event) => `
        <a href='/create-event/${event.id}' class="event">${event.name}</a>
      `)
    if(!active.length) return wire()`<h1>You have no events yet 😔</h1>`
    return active
  }
}
