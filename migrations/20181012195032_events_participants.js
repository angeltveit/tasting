
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events_participants', function(table) {
    table.integer('event_id').references('events.id')
    table.integer('user_id').references('users.id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
