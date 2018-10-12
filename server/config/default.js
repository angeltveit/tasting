module.exports = {
  untappdClientId: process.env.untappdClientId || 'unset',
  untappdClientSecret: process.env.untappdClientSecret || 'unset',
  untappdCallbackUrl: process.env.callbackURL || 'unset',
  database: process.env.DATABASE_URL,
  jwtSecret: process.env.jwtSecret,
  tokenDuration: process.env.tokenDuration || '1d',
}
