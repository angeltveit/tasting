import { bootstrap } from '@scoutgg/widgets'
import { hyper as renderer } from '@scoutgg/widgets/cjs/renderers/hyper'
import { PageRouter, router, routes } from 'widgets-router'
import qs from 'query-string'
import hyper from 'hyperhtml'
import { login, current } from './services/auth'
import rerenderPlugin, { rerender as renderAll } from '@scoutgg/widgets/cjs/plugins/rerender.js'
import simpleHmr from '@scoutgg/widgets/cjs/plugins/simple-hmr.js'
import { emit } from './utils'

// Import the components you want to use
import './pages/auth/auth'
import './pages/welcome/welcome'
import "./pages/create-event/create-event"
import "./pages/join-event/join-event"
import './components/navigation/navigation'
import './pages/manage-event/manage-event'
import './pages/play/play'
import './pages/tv/tv'


if(!window.components) window.components = []

if(module.hot) {
  module.hot.accept()
}


router(function(context, next) {
  if(context.pathname === '/login') return next()
  if(!localStorage.beerToken) {
    if(context.pathname !== '/') sessionStorage.redirectTo = context.pathname
    router.redirect('/login')
  }
  next()
})
// Middleware to check if we have received a token
router('/', function (context, next) {
  const token = qs.parse(window.location.search).token
  if(token || localStorage.beerToken) {
    login(token)
    setTimeout(() => {
      const sessionRoute = sessionStorage.redirectTo
      if(sessionRoute) sessionStorage.removeItem('redirectTo')
      router(sessionRoute || '/welcome')
    }, 250)
  }
})
// Bootstrap Widgets (Start it)
bootstrap([
  emit,
  renderer(hyper),
  rerenderPlugin({})
])
renderAll()
