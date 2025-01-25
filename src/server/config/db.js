import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

// const uri = 'mongodb+srv://cz:cz@cluster0.uvhgvjz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri);

let db;

export async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('MindMaps');
    console.log('Mongo Connected !');
    return db;

  } catch (err) {
    console.log('Error connecting to database:', err);
    throw err;
  }
}

export async function getDb() {

  if (!db) {
    db = connectToDatabase()
  }
  if (!db) {
    throw new Error('Database not found');
  }
  return db;
}

export { ObjectId };