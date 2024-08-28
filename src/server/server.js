// import express from 'express';
// import cors from 'cors';
// import notesRoutes from './routes/notes.js';
// import friendsRoutes from './routes/friends.js';
// import { connectToDatabase } from '../server/config/db.js';

// const app = express();
// const port = 8080;

// app.use(express.json());
// app.use(cors());

// app.listen(port, async () => {
//   console.log(`Server is running on port ${port}`);
//   try {
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

