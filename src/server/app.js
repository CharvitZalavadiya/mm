import express from 'express';
import cors from 'cors';
import notesRoutes from './routes/notes.js';
import friendsRoutes from './routes/friends.js';
import { connectToDatabase } from '../server/config/db.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors({origin: 'https://mind-maps-cz.vercel.app' || 'http://localhost:3000'}));

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    console.log(`connecting to db`)
    connectToDatabase();
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
});

// routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/notes', notesRoutes);
app.use('/friends', friendsRoutes);


process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await client.close();
  process.exit();
});

process.on("SIGTERM", async () => {
  console.log("Shutting down server...");
  await client.close();
  process.exit();
});