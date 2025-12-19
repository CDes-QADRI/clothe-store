import mongoose from 'mongoose';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((m) => m)
      .catch((error) => {
        cached.promise = null;

        const message =
          error instanceof Error ? error.message : String(error);

        if (/bad auth|authentication failed/i.test(message)) {
          throw new Error(
            'MongoDB authentication failed. Check your MONGODB_URI username/password (MongoDB Atlas Database Access) and update the env var locally and on Vercel.'
          );
        }

        throw error;
      });
  }

  cached.conn = await cached.promise;
  global._mongoose = cached;
  return cached.conn;
}
