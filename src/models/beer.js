import { Axios, endpoint, map, base, headers } from '../services/axios'

@endpoint('https://api.untappd.com/v4/search/beer')
@map('response.beers.items')
@headers({
  Authorization: false,
})
export default class Beer extends Axios {
}
