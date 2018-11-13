import { Component, Template } from '@scoutgg/widgets'
import { current } from '../../services/auth'
import { wire } from 'hyperhtml'
import Beer from '../../models/beer'

import '../loading/loading'

let prev = ''

@Component('untappd')
@Template(function (html) {
  html `
  <style>
    .search-beers {
      width: 500px;
    }
    .search-result {
      background-color: rgba(255,255,255,.8);
      color: rgba(0,0,0,0.7);
      width: 500px;
      max-width: 500px;
      height: 500px;
      max-height: 500px;
      overflow: auto;
      position: relative;
    }
    .loading {
      display: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0,0,0,0.25);
    }
    .search-result > .beer {
      display: grid;
      grid-template-columns: 65px 1fr;
      grid-template-rows: 1fr 1fr;
    }
    .search-result img {
      max-width: 65px;
    }
    .search-result .logo {
      grid-row: span 2;
    }
    .beer .title {
      font-size: 1.2em;
    }
    .beer .style {
      color: rgba(0,0,0,.5);
    }
    .beer div:not(.logo) {
      display: flex;
    }
    .beer .title {
      align-items: flex-end;
    }
  </style>
  <beer-input
    class="search-beers"
    value=${this.searchValue}
    placeholder="Search for beers..."
    onchanged=${e => this.search(e.value)}
  ></beer-input>
  <div class="search-result">
    ${this.loading && wire()`
      <div class="loading">
        <beer-loading></beer-loading>
      </div>
    `}
    ${(this.searchResult || []).map(res => wire()`
      <div class="beer" onclick=${() => this.selectBeer(res)}>
        <div class="logo"><img src=${res.beer.beer_label} /></div>
        <div class="title">${res.beer.beer_name}</div>
        <div class="style">${res.beer.beer_style}</div>
      </div>
    `)}
  </div>
  `
})
export default class SearchBeers extends HTMLElement {
  async search(q) {
    if(q === prev) return
    prev = q
    this.searchValue = q
    this.loading = true
    this.render()
    const { beers }  = await Beer.load({ q, access_token: current().token })
      .catch(() => ({beers: []}))
    this.searchResult = beers
    this.loading = null
    this.render()
  }
  selectBeer(item) {
    const beer = {
      uid: item.beer.bid,
      api: 'untappd',
      name: item.beer.beer_name,
      brewery: item.brewery.brewery_name,
      country: item.brewery.country_name,
      label: item.beer.beer_label,
      description: item.beer.beer_description || '',
      style: item.beer.beer_style,
      details: item,
    }
    this.emit('changed', { beer })
  }
}
