import { bootstrap } from '@scoutgg/widgets'
import { hyper as renderer } from '@scoutgg/widgets/cjs/renderers/hyper'
import { PageRouter, router, routes } from 'widgets-router'
import qs from 'query-string'
import hyper from 'hyperhtml'
import { login, current } from './services/auth'
import './components/welcome/welcome'


// Import the components you want to use
import './components/auth/auth'

// Middleware to check if we have received a token
router('/', function(context, next) {
  console.log('hit')
  const token = qs.parse(window.location.search).token
  if(token || localStorage.beerToken) {
    login(token)
    router('/welcome')
  }
  if(!localStorage.beerToken) router.redirect('/login')
})
// Bootstrap Widgets (Start it)
bootstrap([
  renderer(hyper)
])
