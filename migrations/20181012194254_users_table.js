
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments()
    table.enum('role', ['user', 'admin'])
      .defaultTo('user')
      .notNullable()
    table.string('username')
    table.string('untappd_id').unique()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
