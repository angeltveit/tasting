const Joi = require('joi')
const randomString = require('random-string');
const db = require('../../services/db')

const schema = Joi.object().keys({
  name: Joi.string().min(3).max(30).required(),
})

module.exports = async function create_event(req, res) {
  let result = Joi.validate(req.body, schema)
  if(result.error) return res.status(500).json({
    error: result.error.details[0].message,
  })

  const code = randomString({ length: 8 })
  console.log(req.body)
  req.body = Object.assign({}, req.body, {
    code,
  })

  const event = await db('events').insert(Object.assign(req.body))
    .returning(['id', 'name', 'code', 'created_at'])

  res.status(200).json(Object.assign({ status: 'ok' }, event[0]))
}
