import { Router } from "express";
import moviesJSON from '../movies.json' with { type: "json" }
import { MovieController } from "../controllers/MovieController.js";

export const moviesRouter = Router()

// Buscar por género
moviesRouter.get('/', MovieController.getAll)

// Añadir una película 
moviesRouter.post('/', MovieController.add)

// Buscar por género con paginación
// moviesRouter.get('/:page', (req, res) => {
//   const { genre } = req.query
  
//   const elementsPerPage = 5
//   const { page } = req.params
//   const startIndex = (parseInt(page, 10) - 1) * elementsPerPage
//   const endIndex = startIndex + elementsPerPage;
  
//   let filteredMovies = moviesJSON
//   if (genre)  {
//     filteredMovies = moviesJSON.filter(
//       movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
//     )
    
//   }
//   const pagedMovies = filteredMovies.slice(startIndex, endIndex)
  
//   return res.json(pagedMovies)
// })

// Borrar por ID
moviesRouter.delete('/:id', MovieController.delete)

// Modificar una película
moviesRouter.patch('/:id', MovieController.update)

// Buscar película por ID
moviesRouter.get('/:id', MovieController.getById)