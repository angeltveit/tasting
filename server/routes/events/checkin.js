const Joi = require('joi')
const db = require('../../services/db')
const fetch = require('node-fetch')
const qs = require('querystring')
const { URLSearchParams } = require('url');


module.exports = async function startEvent(req, res, next) {
  const checkins = await db('checkins')
    .select([
      'beers.*',
      'user_id',
      'checkins.comment',
      'checkins.rating',
      'checkins.checked_in_at',
    ])
    .where({
      event_id: req.params.id,
      user_id: req.payload.id,
    })
    .join('beers', 'beers.id', 'beer_id')

  const promises = checkins.map(checkin => {
    if(checkin.checked_in_at) {
      console.log('Redundant. Skipping checkin.')
      return Promise.reject({ data: {}})
    }
    const query = qs.stringify({
      access_token: req.payload.token,
    })
    console.log(query)
    const params = new URLSearchParams();
    params.append('gmt_offset', 1);
    params.append('timezone', 'CET');
    params.append('bid', checkin.uid);
    params.append('rating', checkin.rating);
    params.append('shout', checkin.comment);

    return fetch('https://api.untappd.com/v4/checkin/add?' + query, {
      method: 'POST',
      body: params,
    })
  })

  const data = await Promise.all(promises)
    .catch(data => ([{}]))
  data.forEach(async (data) => {
    if(data.ok) {
      const { response } = await data.json()
      console.log('Checkin ', response.result, response.beer.bid, req.payload.id)
      //if(response.result !== 'success') return

      const beer = await db('beers')
        .where({ uid: response.beer.bid })
        .first()

      await db('checkins')
        .update({
          checked_in_at: db.raw('NOW()'),
          checkin_details: response,
        })
        .where({
          beer_id: beer.id,
          user_id: req.payload.id,
          event_id: req.params.id,
        })
    } else {
      console.log('Went in to data not ok')
      //console.log(await data.json())
    }
  })
  res.json({ status: 'ok' })
}
