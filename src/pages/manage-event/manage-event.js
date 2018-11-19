import { Component, Attribute, Template } from '@scoutgg/widgets'
import { Route, router } from 'widgets-router'
import { wire } from 'hyperhtml'
import socket from '../../services/socket.io'
import Event from '../../models/event'

import '../../components/selected-beers/selected-beers'

@Route('/manage/:event')
@Component('beer')
@Attribute('event', Event)
@Template(function (html) {
  html `
    <style>
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    </style>
    ${this.event.state === 'running' ? wire()`
      <beer-selected-beers
        onchanged=${({ beer })=> this.selectBeer(beer)}
      ></beer-selected-beers>
    ` : null }
    ${this.event.state === 'voting' ? wire()`
      <h1>Waiting for participants to finish</h1>
      <beer-loading></beer-loading>
    `: null }
  `
})
export default class ManageEvent extends HTMLElement {
  async connectedCallback() {
    await this.load()
    socket.subscribe(`play:${this.event.id}`)
    socket.on('vote', (payload) => {
      console.log('got', payload)
      this.event.current_beer = payload.event.current_beer
      this.load()
    })
    if(!['pending', 'running', 'voting'].includes(this.event.state)) {
      router(`/create-event/${this.event.id}`)
    }
  }

  async load() {
    const { event } = await this.event.load({ $reload: true })

    this.beers = event.beers[0] ? event.beers : []
    this.checkins = event.checkins[0] ? event.checkins : []
    this.availableBeers = (this.beers || []).filter(beer => {
      if(this.event.current_beer && this.event.current_beer.id === beer.id) return
      return !(this.checkins || []).some((checkin) => checkin.beer_id === beer.id)
    })
    setTimeout(() => {
      const el = this.shadowRoot.querySelector('beer-selected-beers')
      if(el) el.beers = this.availableBeers
    }, 100)

    this.render()
  }

  async selectBeer(beer) {
    await this.event.save('next', { beer: beer.id })
    this.load()
  }

}
