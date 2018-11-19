const Joi = require('joi')
const db = require('../../services/db')

module.exports = async function participate(req, res, next) {
  const event = await db('events')
    .where({
      code: req.params.code.toLowerCase(),
    })
    .first()

  const checkins = await db('checkins')
    .select([
      'beers.*',
      'user_id',
      'checkins.comment',
      'checkins.rating',
    ])
    .where({
      event_id: event.id,
      user_id: req.payload.id,
    })
    .join('beers', 'beers.id', 'beer_id')

  if(event.current_beer) {
    event.current_beer = await db('beers')
      .where({ id: event.current_beer })
      .first()
  }

  let participants = await db('events_participants')
    .select([
      'users.id',
      'users.username',
      'users.untappd_id',
      'users.role',
      'users.avatar',
    ])
    .where({ event_id: event.id })
    .join('users', 'user_id', 'users.id')

  const participated = participants.some(p => p.id === req.payload.id)

  event.participants = participants
  event.checkins = checkins

  if(participated) return res.json({ event, participants, checkins })

  if(event.started_at) return res.status(403).json({ error: 'event_started' })


  await db('events_participants')
    .insert({
      event_id: event.id,
      user_id: req.payload.id,
    }),
  participants = await db('events_participants')
    .select([
      'users.id',
      'users.username',
      'users.untappd_id',
      'users.role',
      'users.avatar',
    ])
    .where({ event_id: event.id })
    .join('users', 'user_id', 'users.id')

  const participant = await db('users')
  .select([
    'users.id',
    'users.username',
    'users.untappd_id',
    'users.role',
    'users.avatar',
  ])
  .where({ id: req.payload.id })
  .first()

  req.io.in(`play:${event.id}`).emit('participate', {
    name: 'participate',
    event,
    participants,
    participant,
    checkins,
  })

  res.json({ event, participants, participant, checkins })
}
