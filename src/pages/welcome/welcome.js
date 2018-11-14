import { Component, Template } from '@scoutgg/widgets'
import { current } from '../../services/auth'
import Event from '../../models/event'
import { wire } from 'hyperhtml'
import moment from 'moment'
import { Route, router } from 'widgets-router'
import socket from '../../services/socket.io'

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
      h3 {
        background-color: var(--primary-3);
        margin: 0;
        padding: .5em;
        text-align: left;
        color: rgba(255,255,255,0.8);
        text-transform: uppercase;
        font-size: 1em;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.8);
      }

      .actions {
        margin-bottom: 2em;
        display: flex;
        justify-content: space-around;
      }
      a {
        color: currentColor;
      }
      .event {
        display: flex;
        padding: 2.5em;
        background-color: var(--primary-2);
        text-decoration: none;
        margin-bottom: .5em;
      }
    </style>

    <h3 class="active">Ongoing events</h3>
    ${this.loaded && this.displayEvents('running')}

    <h3>Your events</h3>
    ${this.loaded && this.displayEvents('pending')}

    <h3>Old events</h3>
    ${this.loaded && this.displayEvents('ended')}
  `
})
export default class Welcome extends HTMLElement {
  async connectedCallback() {
    const { events, active } = await Event.load()
    this.loaded = true
    this.events = events
    this.render()
    socket.on('hello', function(payload) {
      console.log('world', payload)
    })
  }
  get user() {
    return current()
  }

  displayEvents(state) {
    console.log(state)
    const events = (this.events || [])
      .filter(e => e.state === state)
      .map((event) => `
        <a href='/create-event/${event.id}' class="event ${state}">${event.name}</a>
      `)

    if(!events.length) return wire()`
      <p>No events. <b><a href='/create-event'>Create one?</b></p>
    `
    return events
  }
}
