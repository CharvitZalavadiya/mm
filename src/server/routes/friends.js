import express from 'express';
import { getDb } from '../config/db.js';

const router = express.Router();

var collection;

getDb().then((db) => {
  collection = db.collection('User');
});


// sending friend request
router.post('/:id', async (req, res) => {
  const { fromUser, toUser } = req.body; // assuming fromUser and toUser contain their respective IDs
  console.log(`from user: ${fromUser} to user: ${toUser}`);

  try {

    const toUserRequest = await collection.findOne({ clerckId: toUser });
    const fromUserRequested = await collection.findOne({ clerckId: fromUser });

    if (!toUserRequest || !fromUserRequested) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    // Update fromUser's requestSentPeople array
    await collection.updateOne(
      { clerckId: fromUser },
      { $addToSet: { requestSentPeople: toUser } } // Add to array if not already present
    );

    // Update toUser's requestReceivedPeople array
    await collection.updateOne(
      { clerckId: toUser },
      { $addToSet: { requestReceivedPeople: fromUser } } // Add to array if not already present
    );

    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Create user
router.post('/', async (req, res) => {
  const { username, firstname, lastname, imageUrl, id, email } = req.body[0] || {};



  // console.log(username);
  console.log(req.body);
  console.log(username, firstname, lastname, imageUrl, id, email)

  try {
    
    const newUser = {
      username,
      email,
      imageUrl,
      firstname,
      lastname,
      id,
      connectedPeople: [],       // Initialize as empty array
      requestSentPeople: [],     // Initialize as empty array
      requestReceivedPeople: []  // Initialize as empty array
    };

    

    const existingUser = await collection.findOne({ id: newUser.id });

    if (!existingUser) {
      const result = await collection.insertOne(newUser);
      res.status(201).json(result);
      console.log(`New user created: ${newUser.username}`);
    } else {
      console.log(`User: ${newUser.username} already exists`);
      res.status(200).json({ message: 'User already exists' });
      // console.log(newUser);
    }

  } catch (error) {
    console.error('Error creating user:', error); // Use 'error' instead of 'err'
    res.status(500).send('Internal Server Error');
  }
});


export default router;
