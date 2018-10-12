import { Component, Template } from '@scoutgg/widgets'
import { current } from '../../services/auth'
import { Route, router } from 'widgets-router'
import Button from "../button/button"

@Route('/welcome')
@Component('demo')
@Template(function (html) {
  html`
    <h1>Hello ${this.user && this.user.username}</h1>
    <h1>☕Fresh new component «welcome»</h1>
    <beer-button onclick=${() => router("/create-event")}
    } > click me</beer-button >
  `
})
export default class Welcome extends HTMLElement {
  get user() {
    return current()
  }
}
