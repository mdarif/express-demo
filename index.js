const express = require('express')
// const startupDebugger = require('debug')('app:startup')
const debug = require('debug')('app:startup')
// const dbDebugger = require('debug')('app:db')
const config = require('config')
const morgan = require('morgan')
const helmet = require('helmet')
const { log, auth } = require('./logger')
const Joi = require('joi')
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

app.use(auth)

app.use(log) // custome middleware function imported from a module

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
]

app.get('/', (req, res) => {
  // res.send('Hello World')
  res.render('index', { title: 'My Express App', message: 'Hello' })
})

app.get('/api/courses', (req, res) => {
  res.send(courses)
})

// Create a new course
app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body) //result.error
  if (error) {
    // 400 Bad Request
    return res.status(400).send(error.details[0].message)
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  }

  courses.push(course)
  res.send(course)
})

// Update an existing course
app.put('/api/courses/:id', (req, res) => {
  // Look up the course
  // If it does not exist, return 404
  const course = courses.find(course => course.id === parseInt(req.params.id))
  if (!course)
    // If course is not found
    return res.status(400).send('The course with the given id was not found')

  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateCourse(req.body) //result.error
  if (error) {
    // 400 Bad Request
    return res.status(400).send(error.details[0].message)
  }

  // Update course
  course.name = req.body.name

  // Return the updated course
  res.send(course)
})

function validateCourse (course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  }

  return Joi.validate(course, schema)
}

// /api/courses/1
app.get('/api/courses/:id', (req, res) => {
  // res.send(req.params) // Send the requested id of the course to the client
  const course = courses.find(course => course.id === parseInt(req.params.id))
  if (!course)
    // If course is not found
    return res.status(400).send('The course with the given id was not found')
  res.send(course)
})

app.delete('/api/courses/:id', (req, res) => {
  // Look up the course
  // If it doesn't exist, return 404
  const course = courses.find(course => course.id === parseInt(req.params.id))
  if (!course)
    // If course is not found
    return res.status(400).send('The course with the given id was not found')

  // Delete
  const index = courses.indexOf(course)
  courses.splice(index, 1)

  // Return the same course
  res.send(course)
})

// Env. Var: PORT
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
