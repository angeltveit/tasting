const jwt = require('jsonwebtoken')
const config = require('../config')

function determineAuth(req) {
  if(req.get('Beerer')) {
    return { token: req.get('Beerer') }
  }
}

module.exports = function(opts = {}) {
  return function(req, res, next) {
    let {token} = determineAuth(req)
    if(token) {
      jwt.verify(token, config.jwtSecret, function(err, payload) {
        if(err) {
          next()
        } else {
          req.token = token
          req.user = req.payload = payload
          next()
        }
      })
    } else {
      next()
    }
  }
}
