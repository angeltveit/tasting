const Joi = require('joi')
const randomString = require('random-string');
const db = require('../../services/db')

module.exports = async function create_event(req, res) {
  // Get all events created by user
  const events = await db('events')
    .where({
      created_by: req.payload.id,
    })

  const active = await db('events')
    .select('events.*')
    .join('events_participants', 'user_id', req.payload.id)
    .where(db.raw('started_at IS NOT NULL AND ended_at IS NULL'))
    .first()

  res.json({ events, active })
}
