const Joi = require('joi')
const randomString = require('random-string');
const db = require('../../services/db')

const schema = Joi.object().keys({
  code: Joi.string().min(3).max(8).required(),
})

module.exports = async function create_event(req, res) {
  let result = Joi.validate(req.body, schema, { stripUnknown: true })

  if(result.error) return res.status(500).json({
    error: result.error.details[0].message
  })

  const event = await db('events')
    .where({ code: req.body.code.toLowerCase() })
    .first()

  if(!event) return res.status(404).json({ error: 'event not found' })

  await db('events_participants').insert({
    user_id: req.payload.id,
    event_id: event.id,
  })

  const participants =
    await db('events_participants')
      .where({ event_id: event.id })

  res.status(200)
    .json(Object.assign({
      status: 'ok',
    }, Object.assign({}, event, {
      userCount: participants.length,
    })))
}
