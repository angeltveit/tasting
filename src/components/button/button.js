import { Component, Template, Attribute } from '@scoutgg/widgets'
import { PageRouter } from 'widgets-router'

@Component('beer')
@Attribute('href', String, {
  default: 'javascript:void()'
})
@Template(function (html) {
  html `
    <style>
      a {
        display: inline-flex;
        align-items: center;
        padding: var(--button-padding, .5em 1em);
        background: var(--button-background, var(--accent-color));
        color: var(--button-color, var(--accent-text));
        border-radius: var(--button-radius, 2em);
        font-weight: var(--button-font-weight, inherit);
        text-decoration: none;
      }
    </style>
    <a href=${this.href || 'javascript:void()'}><slot></slot></a>
  `
})
export default class Button extends HTMLElement {
}
