const jwt = require('jsonwebtoken')
const config = require('../config')

function determineAuth(req) {
  if(req.query.beerer) {
    return { token: req.query.beerer.token }
  } else if(req.get('Authorization')) {
    let [token] = req.get('Authorization').split(' ').slice(-2)
    return {token}
  } else {
    return {token: ''}
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
