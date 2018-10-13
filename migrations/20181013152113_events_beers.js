
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events_beers', function(table) {
    table.integer('event_id').references('events.id')
    table.integer('beer_id').references('beers.id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.unique(['event_id', 'beer_id'])
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('events_beers')
};
