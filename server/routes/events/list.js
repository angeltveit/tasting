const Joi = require('joi')
const randomString = require('random-string');
const db = require('../../services/db')

module.exports = async function create_event(req, res) {
  // Get all events created by user
  let events
  try {
    events = await db.raw(`
      SELECT
        	events.*,
        	JSON_AGG(DISTINCT u) AS owner
      FROM events_participants AS my_events
      LEFT JOIN events on events.id = my_events.event_id
      LEFT JOIN users u on u.id = created_by
      WHERE my_events.user_id = ? OR created_by = ?
      GROUP BY events.id, my_events.event_id
      ORDER BY my_events.event_id desc
    `, [req.payload.id, req.payload.id])
  } catch(error) {
    console.error(error)
  }

  res.json({ events: events.rows })
}
