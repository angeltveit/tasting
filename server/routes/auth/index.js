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
  let exists = await db('users')
    .where({ untappd_id: req.user.profile.id })
    .first()
  const photos = req.user.profile.photos

  if(!exists) {
    try {
      await db('users').insert({
        untappd_id: req.user.profile.id,
        username: req.user.profile.displayName,
        avatar: photos.length ? photos[photos.length - 1].value : null,
      })
      exists = await db('users')
        .where({
          untappd_id: req.user.profile.id,
        })
        .first()
    } catch (e) {
      console.log(e)
      return res.status(500).json({ error: 'error' })
    }
  }

  const token = createToken({
    token: req.user.accessToken,
    id: exists.id,
    untappdId: exists.untappd_id,
    username: exists.username,
    avatar: exists.avatar,
  })

  res.redirect(`/?token=${token}`)
})


module.exports = app
