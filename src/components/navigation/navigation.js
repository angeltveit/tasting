import { Component, Template } from '@scoutgg/widgets'
import { wire } from 'hyperhtml'
import { current } from '../../services/auth'

@Component('beer')
@Template(function (html) {
  html `
    <style>
      nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100px;
        background-image: url(/assets/images/bg-large.jpg);
        background-position: center;
        background-size: cover;
        animation-duration: 5s;
        animation-iteration-count: infinite;
        -webkit-mask-box-image: url(/assets/images/wave2.svg)
      }
      h1 {
        font-size: 2em;
        font-weight: 300;
        font-family: var(--accent-font);
        filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5));
      }
      @keyframes test {
        0% {
          -webkit-mask-box-image: url(/assets/images/wave2.svg) 0 0 0 0 round round;
        }
        50% {
          -webkit-mask-box-image: url(/assets/images/wave2.svg) 100 100 0 0 round round;
        }
        100% {
          -webkit-mask-box-image: url(/assets/images/wave2.svg) 0 0 0 0 round round;
        }
      }
    </style>
    ${ current() && wire()`
      <nav>
        <h1> ${ current().username } </h1>
      </nav>
    `}
  `
})
export default class Navigation extends HTMLElement {
}
