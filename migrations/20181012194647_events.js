
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', function(table) {
    table.increments()
    table.string('name')
    table.string('code').unique()
    table.integer('current_beer')
    table.timestamp('started_at')
    table.timestamp('ended_at')
    table.integer('created_by')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('events')
};
