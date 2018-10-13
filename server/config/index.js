let config = require('./default')
let dev = ''

if(process.env.STAGE !== 'production') {
  dev = require('./development')
  config = Object.assign({}, config, dev)
}

module.exports = config
