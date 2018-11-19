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

  let event = await db.raw(`
    select
    	events.*,
    	json_agg(distinct p) as participants,
    	json_agg(distinct c) as checkins,
    	json_agg(distinct b) as beers
    from events
    left join (
    	select
    		users.*,
    		event_id
    	from events_participants
    	join users on users.id = user_id
      where event_id = ?
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
      where event_id = ?
    ) c on c.event_id = events.id
    left join (
    	select
    		beers.*,
    		event_id
    	from
    		events_beers
    	join beers on beers.id = beer_id
      where event_id = ?
    ) b on b.event_id = events.id
    where events.id = ?
    group by events.id, p.event_id, c.event_id
    order by events.id
  `,[req.params.id, req.params.id, req.params.id, req.params.id])
  event = event.rows[0]

  // If no event, you do not own it (Currently disabled)
  if(!event) return res.status(403).json({ error: 'Unauthorized' })

  // Clean up
  event.participants = event.participants.filter(e => e)
  event.checkins = event.checkins.filter(e => e)
  event.beers = event.beers.filter(e => e)

  res.status(200).json({ event })
}
