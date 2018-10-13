const app = require('express').Router()
const validateUser = require('../../middleware/validate-user')

app.use(validateUser)
app.post('/', require('./create'))
app.post('/join', require('./join'))

app.get('/', require('./list'))
app.get('/:id', require('./show'))

module.exports = app
