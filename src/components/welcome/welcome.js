import { Component, Template } from '@scoutgg/widgets'
import { current } from '../../services/auth'
import { Route, router } from 'widgets-router'

@Route('/welcome')
@Component('beer')
@Template(function (html) {
  html`
    <h1>Hello ${this.user && this.user.username}</h1>
    <h1>☕Fresh new component «welcome»</h1>
    <beer-button onclick=${() => router("/create-event")}
    } > create event</beer-button >
    <beer-button onclick=${() => router("/join-event")}>join event</beer-button>
  `
})
export default class Welcome extends HTMLElement {
  get user() {
    return current()
  }
}
