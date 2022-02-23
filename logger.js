function log (req, res, next) {
  // middleware 2
  console.log('Logging...')
  next()
}

function auth (req, res, next) {
  // middleware 1
  console.log('Authenticating...')
  next()
}

module.exports = {
  log,
  auth
}
