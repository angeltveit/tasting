const express = require('express')
const path = require('path')
const app = express()
const passport = require('passport')
const port = 3000

require('./helpers/passport-strategy')

app.use(passport.initialize())
app.use(require('./routes'))
app.use('/assets', express.static(path.join(__dirname, '/../assets')))

app.get('/*', (req, res) => res.sendFile(path.join(__dirname + '/../index.html')))
app.listen(port, () => console.log(`Server listening on port ${port} 🍻`))
