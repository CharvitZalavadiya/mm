// import express from 'express';
// import cors from 'cors';
// import notesRoutes from './routes/notes.js';
// import friendsRoutes from './routes/friends.js';
// import chatRoutes from './routes/chat.js';
// import apiRoutes from './routes/api.js';
// import { connectToDatabase } from '../server/config/db.js';

// const app = express();
// const port = 8080;

// app.use(express.json());
// app.use(cors());

// app.listen(port, async () => {
//   console.log(`Server is running on port ${port}`);
//   try {
//     console.log(`connecting to db`)
//     connectToDatabase();
//   } catch (err) {
//     console.error('Error connecting to database:', err);
//   }
// });

// // routes
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
// app.use('/notes', notesRoutes);
// app.use('/friends', friendsRoutes);
// app.use('/chat', chatRoutes);
// app.use('/api', apiRoutes);


// process.on("SIGINT", async () => {
//   console.log("Shutting down server...");
//   await client.close();
//   process.exit();
// });

// process.on("SIGTERM", async () => {
//   console.log("Shutting down server...");
//   await client.close();
//   process.exit();
// });




import express from 'express';
import cors from 'cors';
import notesRoutes from './routes/notes.js';
import friendsRoutes from './routes/friends.js';
import chatRoutes from './routes/chat.js';
import apiRoutes from './routes/api.js';
import flowchartRoutes from './routes/flowchart.js';
import { connectToDatabase } from '../server/config/db.js';
import { initializeSocket } from './config/socket.js'; // Import the socket initialization

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors({
  origin: ["https://mind-maps.vercel.app", "http://localhost:3000", "https://mind-maps-git-flowchart-charvit-zalavadiya.vercel.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Userid"],
  credentials: true,
}));

// Create an HTTP server and pass it to Socket.io
const server = app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    console.log(`Connecting to database...`);
    connectToDatabase();
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
});

// Initialize Socket.io
initializeSocket(server);

// routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/notes', notesRoutes);
app.use('/friends', friendsRoutes);
app.use('/chat', chatRoutes);
app.use('/api', apiRoutes);
app.use('/flowcharts', flowchartRoutes);

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
