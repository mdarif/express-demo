const express = require('express')
// const startupDebugger = require('debug')('app:startup')
const debug = require('debug')('app:startup')
// const dbDebugger = require('debug')('app:db')
const config = require('config')
const morgan = require('morgan')
const helmet = require('helmet')
const log = require('./middleware/logger')
const courses = require('./routes/courses')
const home = require('./routes/home')
const app = express()

// Set view Engine for serverside dynamic html
app.set('view engine', 'pug') // we need not to require it

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
// console.log(`app.get: ${app.get('env')}`) // app.get would return development env incase of NODE_ENV is undefined

app.use(express.json()) // for parsing req.body application/json
app.set('views', './views') // default views folder

// Buildin Middlewares
app.use(express.urlencoded({ extended: true })) // key=value&key=value
app.use(express.static('public'))

//Third-party Middlewares
app.use(helmet())

// Any route start with '/api/courses' will be handled by this router 'courses'
app.use('/api/courses', courses)
app.use('/', home)

// Configuration
/* console.log(`Application Name: ${config.get('name')}`)
console.log(`Mail Server: ${config.get('mail.host')}`)
console.log(`Mail Password: ${config.get('mail.password')}`) */

if (app.get('env') === 'development') {
  // Detect enviroment, default is development for app.get
  app.use(morgan('tiny'))
  debug('Morgan enabled...')
}

// DB work...
// dbDebugger('Connected to the database...')

app.use(log) // custome middleware function imported from a module

// Env. Var: PORT
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
