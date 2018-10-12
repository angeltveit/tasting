const app = require('express').Router()
const passport = require('passport')
const createToken = require('../../helpers/create-token')
const db = require('../../services/db')

app.get('/', passport.authenticate('untappd'))
app.get('/untappd', passport.authenticate('untappd', {
  session: false,
  failureRedirect: '/?error=auth_failed'
}), async (req, res) => {
  // Untappd login successful
  console.log('Imma making a user')
  try {
    await db('users').insert({
      untappd_id: req.user.profile.id,
      username: req.user.profile.displayName
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'error' })
  }


  const token = createToken({
    token: req.user.accessToken,
    id: req.user.profile.id,
    username: req.user.profile.displayName,
  })

  res.redirect(`/?token=${token}`)
})


module.exports = app
