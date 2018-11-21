import { Component, Template } from '@scoutgg/widgets'
import { Route } from 'widgets-router'

@Route('/ios')
@Component('demo')
@Template(function (html) {
  html `
    <style>
      iframe {
        position: fixed;
        top: 1;
        left: 1;
        width: 100vw;
        height: 100vh;
        z-index: 10;
        border: 0;
      }
    </style>
    <iframe src="http://192.168.1.103:3000"></iframe>
  `
})
export default class Appify extends HTMLElement {
}
