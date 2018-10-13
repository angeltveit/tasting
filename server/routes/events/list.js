const Joi = require('joi')
const randomString = require('random-string');
const db = require('../../services/db')

module.exports = async function create_event(req, res) {

  // Get all events created by user
  const events = await db('events').where({
    created_by: req.payload.id,
  })

  res.json(events)
}
