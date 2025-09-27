import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

// Get MongoDB URI with fallback
let mongoUri = process.env.MONGODB_URI as string;

// Fallback if environment variable is not loaded properly
if (!mongoUri) {
  console.log('MONGODB_URI not found in environment, using fallback...');
  mongoUri = 'mongodb+srv://abdellah:abdellah123@ensaoffline.k6ywb9v.mongodb.net/ensaoffline';
}

console.log('Using MongoDB URI:', mongoUri ? 'Set' : 'Not set');

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!global.mongooseConn) {
    global.mongooseConn = { conn: null, promise: null };
  }

  if (global.mongooseConn.conn) {
    return global.mongooseConn.conn;
  }

  if (!global.mongooseConn.promise) {
    const dbName = process.env.MONGODB_DB || 'ensaoffline';
    console.log('Connecting to database:', dbName);
    global.mongooseConn.promise = mongoose.connect(mongoUri, {
      dbName: dbName,
    });
  }

  global.mongooseConn.conn = await global.mongooseConn.promise;
  return global.mongooseConn.conn;
}


