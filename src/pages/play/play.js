import { Component, Attribute, Template } from '@scoutgg/widgets'
import { Route } from 'widgets-router'
import { current } from '../../services/auth'
import { wire } from 'hyperhtml'
import socket from '../../services/socket.io'
import moment from 'moment'
import Event from '../../models/event'
import emitter from '../../services/emitter'
import { letItSnow } from '../../services/snow'
import '../../components/range/range'

@Route('/p/:code')
@Component('beer')
@Attribute('code', String)
@Template(function (html) {
  html `
    <style>
      @import 'https://use.fontawesome.com/releases/v5.5.0/css/all.css';
      :host {
        display: block;
        padding: 2em;
        box-sizing: border-box;
      }
      .avatar {
        height: 4em;
        border-radius: 50%;
        margin-right: .5em;
      }
      li {
        display: flex;
        align-items: center;
      }
      i.fas {
        margin-right: .5em;
        color: var(--success);
        font-size: 1.7em;
      }
      h1 {
        text-align: center;
      }
      .pulse {
        animation-name: pulse;
        animation-duration: 1s;
        animation-iteration-count: infinite;
      }
      .snow {
        display: none;
        position: fixed;
        top: 64px;
        left: 0;
        width: 100%;
        height: calc(100% - 64px);
        pointer-events: none;
      }
      .snow.running {
        display: block;
      }
      beer-range {
        height: 200px;
      }
      @keyframes pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: .4;
        }
        100% {
          opacity: 1;
        }
      }
      textarea {
        display: block;
        font-family: 'Open Sans', sans-serif;
        background-color: var(--secondary-1);
        width: 100%;
        height: 7em;
        font-size: 1.25em;
        font-weight: bold;
      }
      beer-button {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        font-size: 1.5em;
        margin-top: 2em;
      }
    </style>

    <canvas class=${['snow', this.event && this.event.state].join(' ')}></canvas>

    ${this.event && this.event.state === 'pending' ? wire()`
      <h1 class="pulse">Waiting for players</h1>
      <ul>
      ${this.participants ? this.participants.map(participant => wire()`
        <li>
          <i class="fas fa-check-circle"></i>
          <img class="avatar" src=${participant.avatar} />${participant.username}
        </li>
      `) : null}
      </ul>
    ` : null}

    ${this.event && this.event.state === 'running' ? wire()`
      <h1 class="pulse">Waiting for new beer</h1>
      <beer-button onclick=${(e) => this.save() }>
        ${!this.blockReload ? wire()`
          Reload
        ` : wire()`
          <beer-loading></beer-loading>
        `}
      </beer-button>
    ` : null}

    ${this.event && this.event.state === 'voting' ? wire()`
      <h1>Cast your vote</h1>
      <beer-range onchanged=${({ value }) => this.vote.rating = value}></beer-range>
      <textarea onchange=${(e) => this.vote.comment = e.target.value}></textarea>
      <beer-button onclick=${(e) => this.save() }>Cast vote</beer-button>
    ` : null}

    ${this.event && this.event.state === 'ended' ? wire()`
      ${this.myCheckins.map(checkin => {

      })}
    ` : null}
  `
})
export default class Play extends HTMLElement {
  async connectedCallback() {
    this.resetVote()
    await this.load()
    document.addEventListener('visibilitychange', () => {
      this.load()
    })
    const canvas = this.shadowRoot.querySelector('canvas')
    const options = {
      particleImage: '/assets/images/snowflake.png',
      renderer: {
        alpha: 1,
        canvas,
      },
    }
    if(!this.running) {
      letItSnow(options)
      this.running = true
    }
  }
  async reload() {
    if(this.blockReload) return
    this.blockReload = true
    this.render()
    setTimeout(() => {
      this.blockReload = false
      this.render()
    }, 4000)
    await this.load()
  }
  get myCheckins() {
    return this.event.checkins.filter(checkin => {
      return checkin.user_id === current().id
    })
  }
  resetVote() {
    this.vote = {
      rating: 1,
      comment: '',
    }
    this.render()
  }
  async save() {
    await fetch(`/api/events/${this.event}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Beerer ${localStorage.beerToken}`,
      },
      body: JSON.stringify(this.vote),
    })
    this.resetVote()
    this.load()
  }
  async load() {
    const {
      event,
      participants,
      checkins,
    } = await fetch(`/api/events/${this.code}/participate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Beerer ${localStorage.beerToken}`,
      }
    })
      .then(response => response.json())

    socket.subscribe(`play:${event.id}`)

    socket.on('new_beer', (payload) => {
      this.load()
    })
    socket.on('start', (payload) => {
      this.load()
    })

    this.event = new Event(event, { overwrite: true })

    if(this.event.state === 'voting') {
      emitter.emit('hide-navigation')
    } else {
      emitter.emit('show-navigation')
    }

    this.participants = participants
    if(this.event.state === 'ended') {
      await fetch(`/api/events/${this.event.id}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Beerer ${localStorage.beerToken}`,
        }
      })
        .then(res => res.json())
    }
    this.render()
  }
}
