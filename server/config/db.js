import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('[MongoDB] MONGO_URI is not configured. REST API will start, but persistence is unavailable.');
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 1500, connectTimeoutMS: 1500 });
    console.log('[MongoDB] Connected');
    return true;
  } catch (error) {
    console.error('[MongoDB] Connection failed:', error.message);
    mongoose.disconnect().catch(() => {});
    return false;
  }
}
