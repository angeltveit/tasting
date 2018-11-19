import { Component, Template } from '@scoutgg/widgets'
import { wire } from 'hyperhtml'
import { current, logout } from '../../services/auth'
import emitter from '../../services/emitter'

@Component('beer')
@Template(function (html) {
  html `
    <style>
      nav {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 64px;
        background-color: var(--primary-3);
        padding: 0 .5em;
      }
      .brand {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5));
      }
      .back, .action {
        width: 140px;
      }
      .action {
        display: flex;
        justify-content: flex-end;
      }
      .brand img {
        height: 2.25em;
      }
      h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        font-size: 2em;
        font-family: var(--accent-font);
        filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5));
      }
      @keyframes test {
        0% {
          -webkit-mask-box-image: url(/assets/images/wave2.svg) 0 0 0 0 round round;
        }
        50% {
          -webkit-mask-box-image: url(/assets/images/wave2.svg) 100 100 0 0 round round;
        }
        100% {
          -webkit-mask-box-image: url(/assets/images/wave2.svg) 0 0 0 0 round round;
        }
      }
    </style>
    ${ current() && wire()`
      <nav style=${this.visibility}>
        <div class="back"></div>
        <div class="brand">
          <img src="/assets/images/beer.svg" /> <h1>tastr</h1>
        </div>
        <div class="action">
          <beer-button onclick=${() => this.logout()}>Log out</beer-button>
        </div>
      </nav>
    `}
  `
})
export default class Navigation extends HTMLElement {
  connectedCallback() {
    this.show = true
    this.render()
    emitter.on('show-navigation', () => {
      this.show = true
      this.render()
    })
    emitter.on('hide-navigation', () => {
      this.show = false
      this.render()
    })
  }
  logout() {
    logout()
  }
  get visibility() {
    return this.show ? 'display: flex;' : 'display: none;'
  }
}
