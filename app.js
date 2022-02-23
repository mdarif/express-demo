const express = require('express')
const Joi = require('joi')
const app = express()

app.use(express.json()) // for parsing application/json

// Make the genres array object available to the app

const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Horror' },
  { id: 3, name: 'Comedy' }
]

// API Endpoint http://localhost:5000/api/genres

// Getting the list of genres
app.get('/api/genres', (req, res) => {
  res.send(genres)
})

// Create a new genres
app.post('/api/genres', (req, res) => {
  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateGenre(req.body) //result.error
  if (error) {
    // 400 Bad Request
    return res.status(400).send(error.details[0].message)
  }

  // Create a new genre
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }

  // Add the new genre to the array
  genres.push(genre)

  // Return the new genre
  res.send(genre)
})

// Update the genres
app.put('/api/genres/:id', (req, res) => {
  // Look up the genre
  // If it does not exist, return 404
  const genre = genres.find(genre => genre.id === parseInt(req.params.id))
  if (!genre)
    // If genre is not found
    return res.status(400).send('The genre with the given id was not found')

  // Validate genres
  // If invalid, return 400 - Bad request
  const { error } = validateGenre(req.body) //result.error
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // Update genre
  genre.name = req.body.name

  // Return the updated genre
  res.send(genre)
})

// Delete the genres
app.delete('/api/genres/:id', (req, res) => {
  // Look up the genre
  // If it does not exist, return 404
  const genre = genres.find(genre => genre.id === parseInt(req.params.id))
  if (!genre)
    // If genre is not found
    return res.status(400).send('The genre with the given id was not found')

  // Delete the genre
  const index = genres.indexOf(genre)
  genres.splice(index, 1)

  // Return the same genre
  res.send(genre)
})

function validateGenre (genre) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  }

  return Joi.validate(genre, schema)
}

// Up the server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('Server is up on port 5000')
})
