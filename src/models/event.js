import { Axios, endpoint, defaults } from '../services/axios'
import { current } from '../services/auth'

@endpoint('/api/events')
@defaults({
  beers: [],
  participants: [],
})
export default class Event extends Axios {
  get upcoming() {
    return !this.started_at
  }
  get state() {

    if(this.current_beer) {
      const votedOn = this.checkins.filter( c => c.user_id === current().id )
      if(!votedOn.some(c => c.id === (this.current_beer.id || this.current_beer))) return 'voting'
    }

    if(this.started_at && !this.ended_at) return 'running'
    if(!this.started_at && !this.ended_at) return 'pending'
    if(this.started_at && this.ended_at) return 'ended'
    return 'unknown'
  }
}
