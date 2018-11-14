const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const passport = require('passport')
const bodyParser = require('body-parser')

const PORT = 3000
const CLIENTS = []

require('./helpers/passport-strategy')

io.on('connection', function(socket) {
  console.log('Client connected')
  
  socket.on('join', ({ room }) => {
    socket.join([ room ])
  })
})

app.use(bodyParser.json())
app.use(passport.initialize())
app.use(function(req, res, next) {
  req.io = io
  next()
})
app.use('/api',require('./routes'))
app.use('/assets', express.static(path.join(__dirname, '/../assets')))

app.get('/*', (req, res) => res.sendFile(path.join(__dirname + '/../index.html')))
server
  .listen(PORT, () => console.log(`Server listening on port ${PORT} 🍻`))
