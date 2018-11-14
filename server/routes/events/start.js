const Joi = require('joi')
const db = require('../../services/db')

module.exports = async function startEvent(req, res, next) {
  const own = await db('events')
    .where({
      id: req.params.id,
      created_by: req.payload.id,
    })
    .first()

  if(!own) return res.status(403).json({ error: 'unauthorized' })

  await db('events')
    .update({
      started_at: db.raw('NOW()'),
    })
    .where({ id: req.params.id })
    .returning()

  const event = await db('events')
    .where({
      id: req.params.id,
      created_by: req.payload.id,
    })
    .first()
  req.io.in(`play:${event.id}`).emit('start', {
    name: 'start',
    event,
  })

  res.json({ event })
}
