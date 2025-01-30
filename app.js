const express = require('express');
const moviesJSON = require('./movies.json');
const { validateMovie, validatePartialMovie } = require('./schemas/movie-schema');

const app = express()
// Deshabilitar siempre por temas de seguridad
app.disable('x-powered-by')

app.use(express.json())

// metodos normales: GET/HEAD/POST
// metodos complejos: PUT/PATCH/DELETe

ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://movies.com',
  'https://66.81.166.185'
]

// Buscar por género con paginación
app.get('/movies/:page', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  
  const { genre } = req.query
  
  const elementsPerPage = 5
  const { page } = req.params
  const startIndex = (parseInt(page, 10) - 1) * elementsPerPage
  const endIndex = startIndex + elementsPerPage;
  
  let filteredMovies = moviesJSON
  if (genre)  {
    filteredMovies = moviesJSON.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    
  }
  const pagedMovies = filteredMovies.slice(startIndex, endIndex)
  
  return res.json(pagedMovies)
})

// Borrar por ID
app.delete('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(movie => movie.id === id)
  if(movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  
  moviesJSON.splice(movieIndex, 1)
  return res.status(204).send()
})
// CORS Preflight para borrar por ID (Necesitamos pasar Methods para delete)
app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PATCH')
  }
  res.send(200)
})

// Añadir una película 
app.post('/movies', (req, res) => {
  
  const result = validateMovie(req.body)
  
  if(result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  
  // mas adelante mejora con BBDD
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  
  // ESTO NO SERIA REST, porque estamos almacenando el estado 
  // de la aplicacion en memoria
  moviesJSON.push()
  return res.json(newMovie)
})

// Modificar una película
app.patch('/movies/:id', (req, res) => {
  
  const result = validatePartialMovie(req.body)
  
  if(result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  
  const { id } = req.params
  const movieIndex = moviesJSON.findIndex(movie => movie.id === id)
  
  if(movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  
  // mas adelante mejora con BBDD
  const updateMovie = {
    ...moviesJSON[movieIndex], 
    ...result.data
  }
  
  moviesJSON[movieIndex] = updateMovie
  
  return res.json(updateMovie)
})

// Buscar película por ID
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = moviesJSON.find(movie => movie.id === id)
  if(movie) return res.json(movie);
  res.status(404).json({ message: 'Movie Not Found' })
})

const port = process.env.PORT ?? 1234

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})
