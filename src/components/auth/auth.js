import { Component, Template } from '@scoutgg/widgets'
import { wire } from 'hyperhtml'
import { Route } from 'widgets-router'
import { login, current } from '../../services/auth'
import '../button/button'

@Route('/login')
@Component('beer')
@Template(function (html) {
  html `
    <style>
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        width: 100vw;
        background: url('/assets/images/bg-large.jpg');
        background-size: cover;
        background-position: center;
      }
      .untappd {
        --button-color: #fff;
        --button-background: var(--untappd-color);
        --button-font-weight: 800;
        font-size: 1.5em;
        filter: drop-shadow(2px 1px 2px rgba(0, 0, 0, .5));
      }
      .untappd img {
        max-height: 1.5em;
        margin-right: .5em;
      }
    </style>
    ${
      this.user ? wire()`
        <h1>Welcome ${this.user.username}</h1>
      ` : ''
    }
    <beer-button class="untappd" href="/auth">
      <img src="/assets/images/untappd-logo.jpg" alt="Untappd logo" />
      Sign in with Untappd
    </beer-button>
  `
})
export default class Auth extends HTMLElement {
  connectedCallback() {
  }
  get user() {
    return current()
  }
}
