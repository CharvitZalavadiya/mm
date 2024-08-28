import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://cz:cz@cluster0.uvhgvjz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

let db;

export async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('MindMaps'); // Replace with your database name
    // console.log('MongoDB Connected ....');
    console.log('Mongo Connected !');

  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

export { ObjectId };