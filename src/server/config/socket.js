// import { Server as SocketIO } from 'socket.io';
// import Message from '../../models/Message.js'; // Import your Message model
// import { getDb } from './db.js';  // Import your database connection

// let io;
// let collection;

// getDb().then((db) => {
//     collection = db.collection('Chat');
// });

// export const initializeSocket = (server) => {
//   io = new SocketIO(server, {
//     cors: {
//       origin: "*",  // You can restrict this to specific origins in production
//       methods: ["GET", "POST"],
//     }
//   });

//   io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     // Handle incoming messages
//     socket.on('sendMessage', async (message) => {
//       const { from, to, content, timestamp } = message;

//       if (!from || !to || !content || !timestamp) {
//         console.log("Error: All fields are required.");
//         socket.emit('error', { error: "All fields are required." });
//         return;
//       }

//       try {
//         // Save the message to the database
//         const newMessage = new Message({
//           from,
//           to,
//           content,
//           timestamp,
//         });

//         // Assuming you have a `messages` collection in your DB
//         const result = await collection.insertOne(newMessage);
//         // res.status(201).json(result);
        
//         console.log("Message saved to database:", newMessage);

//         // Emit the message to the recipient
//         io.to(`${from}-${to}`).emit('receiveMessage', message);
//       } catch (error) {
//         console.error('Error saving message:', error);
//         socket.emit('error', { error: 'Failed to send message' });
//       }
//     });

//     // Handle user joining chat room
//     socket.on('joinChat', ({ from, to }) => {
//       console.log(`User ${from} joined chat with ${to}`);
//       socket.join(`${from}-${to}`); // Create a room for the pair of users
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//       console.log('User disconnected');
//     });
//   });
// };

// export const getSocket = () => io;







import { Server as SocketIO } from 'socket.io';
import Message from '../../models/Message.js'; // Import your Message model
import { getDb } from './db.js';  // Import your database connection
import {encryptData, decryptData} from "../../utils/cryptojs.js"

let io;
let collection;

getDb().then((db) => {
    collection = db.collection('Chat');
});

export const initializeSocket = (server) => {
  io = new SocketIO(server, {
    cors: {
      origin: "*",  // You can restrict this to specific origins in production
      methods: ["GET", "POST"],
    }
  });

  io.on('connection', (socket) => {

    // Handle user joining chat room
    socket.on('joinChat', ({ from, to }) => {
      console.log(`User ${from} joined chat with ${to}`);
      
      // Create rooms for the pair of users
      socket.join(`${from}-${to}`);
      socket.join(`${to}-${from}`); // Allow the other user to be part of the same room
    });

    // Handle incoming messages
    socket.on('sendMessage', async (message) => {
      const { from, to, content, timestamp } = message;

      if (!from || !to || !content || !timestamp) {
        console.log("Error: All fields are required.");
        socket.emit('error', { error: "All fields are required." });
        return;
      }

      try {
        // Save the message to the database
        const encryptedContent = encryptData(content);

        const newMessage = new Message({
          from,
          to,
          content: encryptedContent,
          timestamp,
        });

        // Assuming you have a `messages` collection in your DB
        await collection.insertOne(newMessage);
        // res.status(201).json(result);
        
        console.log("Message saved to database:", newMessage);

        const decryptedMessage = decryptData(message.content);
        console.log(decryptedMessage)
        console.log(message.content)

        // Emit the message to the recipient (both users will get the message)
        io.to(`${from}-${to}`).emit('receiveMessage', message);
        io.to(`${to}-${from}`).emit('receiveMessage', message); // Send to the other user as well
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { error: 'Failed to send message' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

export const getSocket = () => io;
