const Joi = require('joi')
const randomString = require('random-string');
const db = require('../../services/db')

const schema = Joi.object().keys({
  id: Joi.number().integer().required(),
})

module.exports = async function create_event(req, res) {
  let result = Joi.validate(req.params, schema, { stripUnknown: true })

  if(result.error) return res.status(500).json({
    error: result.error.details[0].message,
  })

  const promises = [
    db('events').where({
      id: req.params.id,
      created_by: req.payload.id,
    }).first(),
    db('events_participants')
      .where({ event_id: req.params.id })
      .select(['users.id', 'username', 'untappd_id'])
      .join('users', 'users.id', 'events_participants.user_id'),
    db('events_beers')
      .select([
        'beers.*',
      ])
      .where({ event_id: req.params.id })
      .leftJoin('beers', 'beers.id', 'events_beers.beer_id'),
    db('checkins')
      .select([
        'checkins.*',
        'users.username',
        'users.role',
        'users.untappd_id',
      ])
      .where({ event_id: req.params.id })
      .join('users', 'users.id', 'checkins.user_id'),
  ]

  const [event, participants, beers, checkins] = await Promise.all(promises)

  // If no event, you do not own it
  if(!event) return res.status(403).json({ error: 'Unauthorized' })

  event.beers = beers
  event.participants = participants

  // TODO: list beers in event
  res.status(200).json({ event, participants, beers, checkins })
}
