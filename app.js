import express, { json } from 'express'
import helmet from 'helmet'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'
import morgan from 'morgan'
import 'dotenv/config'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.use(json())

  app.use(helmet())
  app.use(corsMiddleware())
  app.disable('x-powered-by')
  app.use(morgan('dev'))

  app.get('/', (req, res) => {
    // red query params of format
    res.end('Movies Data')
  })

  app.use('/movies', createMovieRouter({ movieModel }))

  const PORT = process.env.PORT ?? 1234

  app.use((req, res) => {
    res.status(404).send(`
    404
    Not Found try later
  `)
  })

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
  })
}
