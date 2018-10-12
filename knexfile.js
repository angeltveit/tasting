const {parse} = require('pg-connection-string')
const { database } = require('./server/config')
module.exports = {
  client: 'pg',
  connection: parse(database || 'postgres://localhost/tasting'),
}
