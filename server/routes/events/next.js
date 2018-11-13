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
  if(own.current_beer) return res.status(412).json({ error: 'vote_in_progress' })

  await db('events')
    .update({
      current_beer: req.query.beer,
    })
    .where({ id: req.params.id })

  const event = await db('events')
    .where({
      id: req.params.id,
      created_by: req.payload.id,
    })
    .first()

  res.json({ event })
}
