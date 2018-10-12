const app = require('express').Router()
const jwt = require('../middleware/jwt')

app.use(jwt())
app.use('/auth', require('./auth'))
app.use('/events', require('./events'))

module.exports = app
