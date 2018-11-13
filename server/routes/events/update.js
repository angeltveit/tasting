const Joi = require('joi')
const randomString = require('random-string');
const db = require('../../services/db')

const schema = Joi.object().keys({
  name: Joi.string(),
  beers: Joi.array().items(
    Joi.object().keys({
      uid: Joi.required(),
      api: Joi.string().default('untappd'),
      brewery: Joi.string().required(),
      country: Joi.string(),
      name: Joi.string().required(),
      label: Joi.string(),
      description: Joi.string().allow(''),
      style: Joi.string(),
      //ratings: Joi.number().integer(),
      //rating: Joi.number().min(1).max(5),
      details: Joi.object().required(),
      sort: Joi.number(),
    }),
  ),
})

module.exports = async function create_event(req, res) {
  let result = Joi.validate(req.body, schema, {
    convert: true,
    allowUnknown: true,
  })

  if(result.error) return res.status(500).json({
    error: result.error.details[0].message
  })

  // Replace body with validated data
  req.body = result.value

  const access = await db('events')
    .where({ id: req.params.id, created_by: req.payload.id })

  if(!access) return res.status(403).json({ error: 'unauthorized' })
  if(access.started_at) return res.status(409).json({ error: 'event_started' })

  if(req.body.name) {
    await db('events')
      .update({
        name: req.body.name,
      })
      .where({ id: req.params.id })
  }

  const exists = await db('beers')
    .whereIn('uid', req.body.beers.map(b => b.uid))
    .andWhere('api', 'untappd')

  // update existing
  let promises = req.body.beers
    .filter(beer => exists.find(e => e.uid == beer.uid))
    .map(beer => {
      delete beer.sort
      return db('beers')
        .update(beer)
        .where({
          uid: beer.uid,
          api: 'untappd',
        })
    })

  // insert new beers
  req.body.beers
    .filter(beer => !exists.find(e => e.uid == beer.uid))
    .map(beer => {
      delete beer.sort
      return beer
    })
    .forEach(beer => promises.push(db('beers').insert(beer)))

  await Promise.all(promises)

  const beersInEvent = await db('beers')
    .whereIn('uid', req.body.beers.map(b => b.uid))
    .andWhere('api', 'untappd')

  await db('events_beers')
    .where('event_id', req.params.id)
    .delete()

  promises = beersInEvent.map(beer => db('events_beers')
    .insert({
      event_id: req.params.id,
      beer_id: beer.id,
    })
  )

  await Promise.all(promises)

  const eventPromises = [
    db('events').where({ id: req.params.id }).first(),
    db('events_participants')
      .where({ event_id: req.params.id })
      .select(['users.id', 'username', 'untappd_id'])
      .join('users', 'users.id', 'events_participants.user_id'),
    db('events_beers')
      .select('beers.*')
      .where({ event_id: req.params.id })
      .leftJoin('beers', 'beers.id', 'events_beers.beer_id')
  ]

  const [event, participants, beers] = await Promise.all(eventPromises)
  event.beers = beers
  event.participants = participants

  res.json({ status: 'ok', event })
}
