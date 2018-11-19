
exports.up = function(knex, Promise) {
  return knex.schema.createTable('checkins', function(table) {
    table.integer('event_id').references('events.id')
    table.integer('beer_id').references('beers.id')
    table.integer('user_id').references('users.id')
    table.string('comment')
    table.float('rating')
    table.jsonb('checkin_details')
    table.timestamp('checked_in_at')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.primary(['event_id', 'beer_id', 'user_id'])
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('checkins')
};
