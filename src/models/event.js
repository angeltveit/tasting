import { Axios, endpoint, defaults } from '../services/axios'

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
    if(this.current_beer) return 'voting'
    if(this.started_at && !this.ended_at) return 'running'
    if(!this.started_at && !this.ended_at) return 'pending'
    if(this.started_at && this.ended_at) return 'ended'
    return 'unknown'
  }
}
