import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) throw new Error("Mongo URI não definido. Verifique seu .env");

export const connectiondb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Database connected');
  } catch (err) {
    console.error("Falha ao se conectar ao banco", err);
    process.exit(1);
  }
};
