const app = require('express').Router()
const db = require('../../services/db')

app.post('/', require('./create'))
app.post('/join')

module.exports = app
