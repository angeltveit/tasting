const Joi = require('joi')
const randomString = require('random-string');
const db = require('../../services/db')

module.exports = async function create_event(req, res) {
  // Get all events created by user
  const events = await db.raw(`
    select
    	events.*,
    	json_agg(distinct p) as participants,
    	json_agg(distinct c) as checkins
    from events
    left join (
    	select
    		users.*,
    		event_id
    	from events_participants
    	join users on users.id = user_id
      where user_id = ?
    ) p on p.event_id = events.id
    left join (
    	select
    		users.*,
    		beer_id,
    		comment,
    		rating,
    		checkins.created_at,
    		event_id
    	from
    		checkins
    	join users on users.id = user_id
      where event_id = events.id
    ) c on c.event_id = events.id
    group by events.id, p.event_id, c.event_id
    order by events.id
  `, [req.payload.id])
  res.json({ events: events.rows })
}
