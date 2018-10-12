const app = require('express').Router()
const db = require('../../services/db')

app.post('/', require('./create'))
app.post('/join', require('./join'))

module.exports = app
