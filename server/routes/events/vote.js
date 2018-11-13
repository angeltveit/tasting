const Joi = require('joi')
const db = require('../../services/db')

module.exports = async function checkin(req, res, next) {
  let event = await db('events')
    .where({
      id: req.params.id,
    })
    .first()

  if(!event.started_at) return res.status(403)
    .json({ error: 'event_not_started' })

  if(!event.current_beer) return res.status(403)
    .json({ error: 'no_current_beer' })

  const participants = await db('events_participants')
    .select(['users.username', 'users.untappd_id', 'users.avatar'])
    .join('users', 'user_id', 'users.id')
    .where({
      event_id: event.id,
    })

  const participated = !participants.some(p => p.id === req.payload.id)

  if(!participated) return res.status(403).json({ error: 'unauthorized' })

  const checkin = await db('checkins')
    .where({
      event_id: event.id,
      user_id: req.payload.id,
      beer_id: event.current_beer,
    })
    .first()

  if(!checkin) {
    await db('checkins')
      .insert({
        event_id: event.id,
        user_id: req.payload.id,
        beer_id: event.current_beer,
        comment: req.body.comment,
        rating: req.body.rating,
      })
  }

  let [totalCheckins, checkins, beers] = await Promise.all([
      db('checkins')
        .where({
          event_id: event.id,
        }),
      db('checkins')
        .where({
          event_id: event.id,
          beer_id: event.current_beer,
        }),
      db('events_beers')
        .where({
          event_id: event.id
        })
    ])

  if(checkins.length === participants.length && event.current_beer) {
    await db('events')
      .update({
        current_beer: null,
      })
      .where({
        id: event.id
      })
  }

  if(totalCheckins.length / participants.length ===  beers.length) {
    await db('events')
      .update({
        current_beer: null,
        ended_at: db.raw('NOW()'),
      })
      .where({
        id: event.id
      })
  }

  event = await db('events')
    .where({
      id: req.params.id,
    })
    .first()

  res.json({ event, checkin })
}
