const app = require('express').Router()
const passport = require('passport')
const createToken = require('../../helpers/create-token')

app.get('/', passport.authenticate('untappd'))
app.get('/untappd', passport.authenticate('untappd', {
  session: false,
  failureRedirect: '/?error=auth_failed'
}), (req, res) => {
  // Untappd login successful
  // TODO: add jwt-token
  const token = createToken({
    token: req.user.accessToken,
    id: req.user.profile.id,
    username: req.user.profile.displayName,
  })

  res.redirect(`/?token=${token}`)
})


module.exports = app
