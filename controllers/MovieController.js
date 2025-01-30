import { MovieModel } from '../models/MovieModel.js';
import { validateMovie, validatePartialMovie } from '../schemas/movie-schema.js';

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre });
    //que es lo que renderiza?
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
  
    const movie = await MovieModel.getById({ id })
  
    if(movie) return res.json(movie);
  
    res.status(404).json({ message: 'Movie Not Found' })
  }

  static async delete (req, res) {
    const { id } = req.params
  
    const result = await MovieModel.getById({ id })
  
    if(result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    
    return res.json('Movie deleted')
  }

  static async add (req, res) {
    
    const result = validateMovie(req.body)
    if(result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
  
    const newMovie = await MovieModel.create(result.data)

    return res.json(newMovie)
  }

  static async update (req, res)  {

    const { id } = req.params
    
    const result = validatePartialMovie(req.body)
    if(result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    
    const updatedMovie = await MovieModel.update({ id, input: result.data })
    
    return res.json(updatedMovie)
  }
}