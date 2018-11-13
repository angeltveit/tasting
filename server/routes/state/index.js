const app = require('express').Router()
const validateUser = require('../../middleware/validate-user')

app.use(validateUser)
app.get('/', require('./list'))

module.exports = app
