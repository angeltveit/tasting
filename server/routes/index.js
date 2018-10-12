const app = require('express').Router()

app.use('/auth', require('./auth'))
app.use('/events', require('./events'))

module.exports = app
