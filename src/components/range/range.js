import {
  Component,
  Template,
  Attribute
} from '@scoutgg/widgets'
import {
  input
} from '../../utils'

const values = [
  "Dette ølet er så dårlig at du går over regnskapet ditt for å se om du har råd til å engasjere en leiemorder for å få bryggeren tatt av dage og gjøre verden til et bedre sted",
  "Dette brygget brygger din egen bitterhet mot verden og er enda et steg nærmere ditt mentale sammenbrudd",
  "Ølet er såpass dårlig at du kommer til å fortelle eventuelle småsøsken at julenissen ikke finnes",
  "Ølet er ingen suksess, du blir lei deg, men awesome julegaver kan redde julefreden",
  "Du blir verken skuffet eller imponert. Julen fortsetter som en hvilkensomhelst annen jul, men du finner ikke igjen barnet i deg",
  "Eventuelt “det er tanken som teller” julegaver aksepteres på en troverdig måte",
  "Hvis du blir servert et brygg av denne karakter vil du frivillig gå rundt juletreet, selv om det står i et hjørne",
  "Selv om du bor i bergen ser du snø og julestemning utenfor vinduet. Dine julesalmer vil glede besteforeldre og sikre arven din",
  "Du blir sittende ved bordet og drikke øl hele kvelden, julegavende glemmes, og julen vil for alltid huskes",
  "Hmmm",
]

@Component('beer')
@Template(function(html) {
  html `
    <style>
      :host {
        display: block;
      }

      input[type="range"]{
        -webkit-appearance:none;
        width: 100%;
        height:20px;
        background: linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) 100%);
        background-size: 100% 10px;
        background-position:center;
        background-repeat:no-repeat;

        outline: none;
      }

      input[type="range"]:first-of-type{
        margin-top:30px;
      }

      input[type="range"]::-webkit-slider-thumb{
        -webkit-appearance:none;
        border: 0;
        width:50px;
        height:50px;
        background: url(/assets/images/beer.svg);
        position:relative;
        z-index:3;
      }

      input[type="range"]::-webkit-slider-thumb:after{
        content:" ";
        width:100%;
        height:10px;
        position:absolute;
        z-index:1;
        right:20px;
        top:5px;
        background: #ff5b32;
        background: linear-gradient(to right, #f088fc 1%, #AC6CFF 70%);
      }
      .grade {
        display: grid;
        grid-template-columns: 64px auto;
        grid-gap: 1.5em;
        margin-top: 1.5em;
        height: 150px;
      }
      .value {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
      }
      .description {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>

    <div class="grade">
      <div class="value">${this.value}</div>
      <div>${this.description}</div>
    </div>

    <input
      type='range'
      value=1
      min=1
      max=10
      oninput=${(e) => this.update(e)}
    />
  `
})
export default class Range extends HTMLElement {
  connectedCallback() {
    this.value = 0.5
    this.description = values[0]
  }
  update({
    target
  }) {
    this.value = target.value / 2
    this.description = values[+target.value - 1]
    this.render()
    this.emit('changed', {
      value: target.value / 2
    })
  }
}
