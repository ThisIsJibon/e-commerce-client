// /lib/db.js
import mongoose from 'mongoose';


const MONGO_URL = process.env.MONGO_URL 

if (!MONGO_URL) {
  throw new Error(
    'Please define the MONGODB_URL environment variable inside .env'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function db() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  console.log("Connected to DB")
  return cached.conn;
}

export default db