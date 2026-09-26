import 'dotenv/config'
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

const url = process.env.MONGODB_URI

if (!url) {
  throw new Error('Falta la variable de entorno MONGODB_URI en el archivo .env')
}

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

let connection = null

// Conectar UNA SOLA VEZ
async function connect() {
  if (connection) {
    return connection // Reutiliza si ya existe
  }

  try {
    await client.connect()
    connection = client.db('database').collection('movies')
    console.log('Conectado a MongoDB')
    return connection
  } catch (error) {
    console.error('Error de conexión:', error.message)
    throw error
  }
}

// Cerrar conexión cuando termina la app
export async function disconnect() {
  if (client) {
    await client.close()
    connection = null
  }
}

export class MovieModel {
  static async getAll({ genre }) {
    const db = await connect()

    if (genre) {
      return db
        .find({
          genre: {
            $elemMatch: {
              $regex: genre,
              $options: 'i',
            },
          },
        })
        .toArray()
    }

    return db.find({}).toArray()
  }

  static async getById({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async create({ input }) {
    const db = await connect()
    const { insertedId } = await db.insertOne(input)
    return { id: insertedId, ...input }
  }

  static async delete({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }

  static async update({ id, input }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    const { value } = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: input },
      { returnDocument: 'after' }, // ← Cambié 'returnNewDocument' por 'returnDocument'
    )
    return value
  }
}
