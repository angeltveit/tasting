module.exports = function(req, res, next) {
  if(!req.payload) return res.status(403).json({ error: 'unauthorized' })
  next()
}
