const Joi = require('joi')
const randomString = require('random-string');
const db = require('../../services/db')

const schema = Joi.object().keys({
  beers: Joi.array().items(
    Joi.object().keys({
      uid: Joi.string().required(),
      api: Joi.string().default('untappd'),
      brewery: Joi.string().required(),
      country: Joi.string(),
      name: Joi.string().required(),
      label: Joi.string(),
      description: Joi.string(),
      style: Joi.string(),
      ratings: Joi.number().integer(),
      rating: Joi.number().min(1).max(5),
      details: Joi.object().required(),
      sort: Joi.number().required(),
    }),
  ).unique('sort'),
})

module.exports = async function create_event(req, res) {
  let result = Joi.validate(req.body, schema)

  if(result.error) return res.status(500).json({
    error: result.error.details[0].message
  })

  const exists = await db('beers')
    .whereIn('uid', req.body.beers.map(b=> b.uid))
    .andWhere('api', 'untappd')

  // update existing
  let promises = req.body.beers
    .filter(beer => exists.find(e=> e.uid === beer.uid))
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
    .filter(beer => !exists.find(e=> e.uid === beer.uid))
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

  res.json({ status: 'ok' })
}
