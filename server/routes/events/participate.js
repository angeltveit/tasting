const Joi = require('joi')
const db = require('../../services/db')

module.exports = async function participate(req, res, next) {
  const event = await db('events')
    .where({
      code: req.params.code.toLowerCase(),
    })
    .first()

  if(event.current_beer) {
    event.current_beer = await db('beers')
      .where({ id: event.current_beer })
      .first()
  }

  const participants = await db('events_participants')
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

  if(participated) return res.json({ event, participants })
  if(event.started_at) return res.status(403).json({ error: 'event_started' })

  await db('events_participants')
    .insert({
      event_id: event.id,
      user_id: req.payload.id,
    })

  res.json({ event, participants })
}
