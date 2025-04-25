import mongoose from "mongoose"
import "server-only"

// Prevent Mongoose from being bundled for client-side
let cached = global.mongoose

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/flowva"

    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable")
    }

    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
