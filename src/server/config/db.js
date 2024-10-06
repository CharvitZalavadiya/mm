import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://cz:cz@cluster0.uvhgvjz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// const uri = 'mongodb+srv://cz:cz@cluster0.uvhgvjz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

let db;

export async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('MindMaps'); // Replace with your database name
    // console.log('MongoDB Connected ....');
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