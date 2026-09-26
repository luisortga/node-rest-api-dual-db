import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: process.env.MYSQL_PASSWORD,
  database: 'moviesdb',
}

const connectionString = process.env.MYSQL_URI ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class MovieModel {
  static async getAll({ genre }) {
    console.log('getAll')

    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      // get genre ids from database table using genre names
      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre],
      )

      // no genre found
      if (genres.length === 0) return []

      // get the id from the first genre result
      const [{ id: genreId }] = genres

      const [movies] = await connection.query(
        `SELECT DISTINCT
          m.title,
          m.year,
          m.director,
          m.duration,
          m.poster,
          m.rate,
          BIN_TO_UUID(m.id) as id
        FROM movie m
        INNER JOIN movie_genres mg ON m.id = mg.movie_id
        WHERE mg.genre_id = ?;`,
        [genreId],
      )

      return movies
    }

    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;',
    )

    return movies
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id],
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create({ input }) {
    const {
      // genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input

    // todo: crear la conexión de genre

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate],
      )
    } catch {
      // puede enviarle información sensible
      throw new Error('Error creating movie')
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid],
    )

    return movies[0]
  }

  static async delete({ id }) {
    try {
      const [result] = await connection.query(
        'DELETE FROM movie WHERE id = UUID_TO_BIN(?);',
        [id],
      )

      // result.affectedRows indica cuántas filas se eliminaron
      if (result.affectedRows === 0) {
        return null // No se encontró la película
      }

      return { message: 'Película eliminada correctamente' }
    } catch {
      throw new Error('Error eliminando la película')
    }
  }

  static async update({ id, input }) {
    const { title, year, duration, director, rate, poster } = input

    try {
      // Construir dinámicamente la consulta UPDATE
      const fields = []
      const values = []

      if (title !== undefined) {
        fields.push('title = ?')
        values.push(title)
      }
      if (year !== undefined) {
        fields.push('year = ?')
        values.push(year)
      }
      if (duration !== undefined) {
        fields.push('duration = ?')
        values.push(duration)
      }
      if (director !== undefined) {
        fields.push('director = ?')
        values.push(director)
      }
      if (rate !== undefined) {
        fields.push('rate = ?')
        values.push(rate)
      }
      if (poster !== undefined) {
        fields.push('poster = ?')
        values.push(poster)
      }

      // Si no hay campos para actualizar
      if (fields.length === 0) {
        return await MovieModel.getById({ id })
      }

      // Agregar el ID al final
      values.push(id)

      const query = `UPDATE movie SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?);`

      await connection.query(query, values)

      // Retornar la película actualizada
      const [movies] = await connection.query(
        `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
        [id],
      )

      if (movies.length === 0) return null

      return movies[0]
    } catch {
      throw new Error('Error actualizando la película')
    }
  }
}
