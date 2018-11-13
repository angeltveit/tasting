import { Component, Attribute, Template } from '@scoutgg/widgets'
import { Route } from 'widgets-router'
import { current } from '../../services/auth'
import { wire } from 'hyperhtml'

import Event from '../../models/event'

import '../../components/range/range'

@Route('/p/:code')
@Component('beer')
@Attribute('code', String)
@Template(function (html) {
  html `
    <style>
      .avatar {
        height: 50px;
        border-radius: 50%;
        margin-right: .5em;
      }
      li {
        display: flex;
        align-items: center;
      }
    </style>


    ${this.event && this.event.state === 'pending' ? wire()`
      <h1>Waiting for players</h1>
      <ul>
      ${this.participants ? this.participants.map(participant => wire()`
        <li><img class="avatar" src=${participant.avatar} />${participant.username}</li>
      `) : null}
      </ul>
    ` : null}

    ${this.event && this.event.state === 'running' ? wire()`
      <h1>Waiting for new beer</h1>
    ` : null}

    ${this.event && this.event.state === 'voting' ? wire()`
      <h1>Now voting for ${this.event.current_beer.name}</h1>
      <beer-range onchanged=${({ value }) => this.vote.rating = value}></beer-range>
      <textarea onchange=${(e) => this.vote.comment = e.target.value}></textarea>
      <button onclick=${(e) => this.save() }>Cast vote</button>
    ` : null}

    ${this.event && this.event.state === 'ended' ? wire()`
      <h1>Thank you! We're done!</h1>
    ` : null}
  `
})
export default class Play extends HTMLElement {
  connectedCallback() {
    this.resetVote()
    this.load()
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
    const { event, participants } = await fetch(`/api/events/${this.code}/participate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Beerer ${localStorage.beerToken}`,
      }
    })
      .then(response => response.json())

    this.event = new Event(event, { overwrite: true })
    this.participants = participants
    this.render()
  }
}
