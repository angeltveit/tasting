const app = require('express').Router()

app.use('/auth', require('./auth'))

module.exports = app
