import { Component, Template } from '@scoutgg/widgets'
import { Route } from 'widgets-router'

@Route('/logout')
@Component('demo')
@Template(function (html) {
  html `
    <style>

    </style>
    <h1>Logging out?</h1>
  `
})
export default class Logout extends HTMLElement {
  connectedCallback() {
    localStorage.clear()
    sessionStorage.clear()
    setTimeout(() => {
      window.location.href = '/welcome'
    }, 500)
  }
}
