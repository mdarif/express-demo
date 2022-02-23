function log (req, res, next) {
  // middleware 2
  console.log('Logging...')
  next()
}

module.exports = log
