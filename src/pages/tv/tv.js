import { Component, Attribute, Template } from '@scoutgg/widgets'
import { Route } from 'widgets-router'
import Event from '../../models/event'
import socket from '../../services/socket.io'
import { letItSnow } from '../../services/snow'
import { wire } from 'hyperhtml'

@Route('/tv/:event')
@Component('demo')
@Attribute('event', Event)
@Template(function (html) {
  html `
    <style>
      @import 'https://use.fontawesome.com/releases/v5.5.0/css/all.css';
      :host {
        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: 1fr 1fr;
        height: 100vh;
        width: 100vw;
        background: #315faf;
        background: -moz-radial-gradient(center, ellipse cover, #315faf 0%, #1b1c29 100%);
        background: -webkit-radial-gradient(center, ellipse cover, #315faf 0%,#1b1c29 100%);
        background: radial-gradient(ellipse at center, #315faf 0%,#1b1c29 100%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#315faf', endColorstr='#1b1c29',GradientType=1 );
      }
      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      header {
        grid-column: span 2;
        text-align: center;
        padding: .5em;
        font-size: 6em;
        filter: drop-shadow(3px 2px 1px rgba(0,0,0,1));
        font-weight: bold;
      }
      h1 {
        font-size: 3.5em;
        filter: drop-shadow(3px 2px 1px rgba(0,0,0,1));
        margin: 0;

      }
      h2 {
        font-size: 3em;
      }
      .snow {
        position: fixed;
        top: 64px;
        left: 0;
        width: 100%;
        height: calc(100% - 64px);
        pointer-events: none;
      }
      .logo {
        height: 35vh;
      }
      .participant .avatar {
        height: 4em;
        border-radius: 50%;
        margin-right: .5em;
      }
      .participant {
        display: flex;
        align-items: center;
        background-color: var(--primary-1);
        margin-right: .5em;
        padding: .5em 1em;
        box-sizing: border-box;
        transform: rotate(90deg);
        transform-origin: center;
        animation-name: participate;
        animation-duration: 300ms;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
        margin-bottom: .25em;
      }
      .participant i.fas {
        margin-right: .5em;
        color: var(--success);
        font-size: 1.7em;
        margin-left: auto;
      }
      .participants {
        font-size: 1.5em;
      }
      @keyframes participate {
        from {
          transform: rotateX(90deg);
        }
        to {
          transform: rotateX(0deg);
        }
      }
    </style>
    <canvas class="snow"></canvas>
    <header>
      <div>${this.event.name}</div>
      <small>Visit ${window.location.origin}/p/${this.event.code}</small>
    </header>
    <div class="left">
      <img class="logo" src="/assets/images/beer.svg" />
      <h1>tastr</h1>
    </div>
    <div class="right">
    ${this.event.state === 'pending' ? wire()`

      <div class="participants">
        ${this.participantsList}
      </div>
    ` : null}

    ${this.event.state === 'running' ? wire()`
      <h2>New beer coming up!</h2>
      <div class="participants">
        ${this.participantsList}
      </div>
    ` : null}

    ${this.event.state === 'voting' ? wire()`
      <h2>Waiting for votes:</h2>
      <div class="participants">
        ${this.participantsList}
      </div>
    ` : null}
    ${this.event.state === 'ended' ? wire()`
      <h2>DONE</h2>
    ` : null}
    </div>
  `
})
export default class Tv extends HTMLElement {
  async connectedCallback() {
    const nav = document.querySelector('beer-navigation')
    if(nav) nav.style.display = 'none';

    socket.subscribe(`play:${this.event.id}`)
    socket.on('new_beer', (payload) => {
      this.load()
    })
    socket.on('start', (payload) => {
      this.load()
    })
    socket.on('vote', (payload) => {
      this.load()
    })
    socket.on('participate', (payload) => {
      if(payload.participant) this.event.participants.push(payload.participant)
      this.render()
    })
    await this.load()
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
  get participantsList() {
    return (this.participants || []).map(participant => wire(participant)`
      <div class="participant">
        <img class="avatar" src=${participant.avatar} />${participant.username}
        ${['voting', 'running', 'pending'].includes(this.event.state) ? wire()`
          <i class=${this.checkClass(participant) ? 'fas fa-check-circle' : ''}></i>
        ` : null}
        ${['running'].includes(this.event.state) ? wire()`
          <b>3.5</b>
        ` : null}
      </div>
    `)
  }
  checkClass(participant) {
    switch(this.event.state) {
      case 'pending':
        return true;
      break;
      case 'voting':
        return this.event.checkins.some(c => {
          return c.id === participant.id && c.beer_id === this.event.current_beer
        })
      break;
      case 'running':
        return true
      break;
    }
  }
  async load() {
    const data = await this.event.load({ $reload: true })
    this.participants = this.event.participants
    console.log(data)
    this.render()
  }
}
