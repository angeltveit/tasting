const passport = require('passport')
const UntappdStrategy = require('passport-untappd')
const config = require('../config')
console.log('loaded', config)
passport.use(new UntappdStrategy({
  clientID: config.untappdClientId,
  clientSecret: config.untappdClientSecret,
  callbackURL: config.untappdCallbackUrl,
}, (accessToken, refreshToken, profile, done) => {
  // Handle user data I guess?
  if(!accessToken || !profile) return done(null)
  done(null, { accessToken, profile })
}))
