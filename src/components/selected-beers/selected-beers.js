import { Component, Template } from '@scoutgg/widgets'
import { wire } from 'hyperhtml'
import { input } from '../../utils'


@Component('beer')
@input('beers')
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
  <div class="search-result">
    ${(this.beers || []).map(beer => wire()`
      <div class="beer" onclick=${() => this.emit('changed', { beer: beer })}>
        <div class="logo"><img src=${beer.label} /></div>
        <div class="title">${beer.name}</div>
        <div class="style">${beer.style}</div>
      </div>
    `)}
  </div>
  `
})
export default class SelectedBeers extends HTMLElement {
}
