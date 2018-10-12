const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.tokenDuration,
  })
}
