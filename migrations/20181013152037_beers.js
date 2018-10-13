
exports.up = function(knex, Promise) {
  return knex.schema.createTable('beers', function(table) {
    table.increments()
    table.string('uid')
    table.string('api').defaultTo('untappd') // Support for multiple apis in the future
    table.string('brewery')
    table.string('country')
    table.string('name')
    table.string('label')
    table.text('description')
    table.string('style')
    table.integer('ratings') // Number of checkins
    table.float('rating') // Average rating
    table.jsonb('details')
    table.integer('created_by').references('users.id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.unique(['uid', 'api'])
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('beers')
};
