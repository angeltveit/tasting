import { Component, Template, Attribute } from '@scoutgg/widgets'
import { input } from '../../utils'

@Component('beer')
@Attribute('type', String, { default: 'text' })
@Attribute('value', String, { default: '' })
@Attribute('key', String, { default: '' })
@Attribute('placeholder', String, { default: '' })
@Template(function (html) {
  html `
    <style>
      :host {
        display: block;
      }
      input {
        font-size: 1.15em;
        padding: .5em;
        border: .25em solid #e5e5e5;
        outline: none;
        box-sizing: border-box;
        width: 100%;
      }
      input:not(:last-of-type) {
        border-bottom: 0;
      }
      input:focus {
        ouline: none;
        background-color: #efffe8;
        color: rgba(0,0,0,.8);
      }
    </style>
    <input
      type=${this.type}
      value=${this.value}
      placeholder=${ this.placeholder }
      onkeydown=${(e) => this.keydown(e)}
      onblur=${(e) => this.update(e)}
    />
  `
})
export default class Input extends HTMLElement {
  update({ target }) {
    this.emit('changed', { value: target.value, key: this.key })
  }
  keydown(e) {
    if(e.which === 13) this.update(e)
  }
}
