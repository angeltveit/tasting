import { Component, Template } from '@scoutgg/widgets'
import { current } from '../../services/auth'
import { Route } from 'widgets-router'

@Route('/welcome')
@Component('demo')
@Template(function (html) {
  html `
    <h1>Hello ${this.user.username}</h1>
    <h1>☕Fresh new component «welcome»</h1>
  `
})
export default class Welcome extends HTMLElement {
  get user() {
    return current()
  }
}
