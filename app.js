import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'

const app = express()
// Deshabilitar siempre por temas de seguridad
app.disable('x-powered-by')
app.use(json())
app.use('/movies', moviesRouter)
app.use('cors', corsMiddleware)

const port = process.env.PORT ?? 1234

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})
