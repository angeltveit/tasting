const app = require('express').Router()
const validateUser = require('../../middleware/validate-user')

app.use(validateUser)
app.post('/', require('./create'))
app.post('/:code/participate', require('./participate'))
app.post('/:id/vote', require('./vote'))
app.post('/:id/checkin', require('./checkin'))

app.patch('/:id', require('./update'))
app.patch('/:id/start', require('./start'))
app.patch('/:id/next', require('./next'))

app.get('/', require('./list'))
app.get('/:id', require('./show'))

module.exports = app
