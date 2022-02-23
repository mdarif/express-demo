const express = require('express')
const Joi = require('joi')
const router = express.Router()

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
]

// Get all the courses
router.get('/', (req, res) => {
  res.send(courses)
})

// Create a new course
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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

// /api/courses/1
router.get('/:id', (req, res) => {
  // res.send(req.params) // Send the requested id of the course to the client
  const course = courses.find(course => course.id === parseInt(req.params.id))
  if (!course)
    // If course is not found
    return res.status(400).send('The course with the given id was not found')
  res.send(course)
})

router.delete('/:id', (req, res) => {
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

function validateCourse (course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  }

  return Joi.validate(course, schema)
}

module.exports = router
