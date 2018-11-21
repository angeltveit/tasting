const Joi = require('joi')
const randomString = require('random-string');
const db = require('../../services/db')

const schema = Joi.object().keys({
  name: Joi.string().min(3).max(30).required(),
})

module.exports = async function create_event(req, res) {
  let result = Joi.validate(req.body, schema, { stripUnknown: true })

  if(result.error) return res.status(500).json({
    error: result.error.details[0].message,
  })

  req.body = result.value

  const code = randomString({
    readable: true,
    capitalization: false,
    length: 6,
  })

  req.body = Object.assign({}, req.body, {
    code: code.toLowerCase(),
    created_by: req.payload.id,
  })

  const event = await db('events').insert(req.body)
    .returning(['id', 'name', 'code', 'created_at'])

  res.status(200).json({ status: 'ok', event: event[0] })
}
