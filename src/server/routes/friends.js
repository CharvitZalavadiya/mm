import express from 'express';
import { getDb } from '../config/db.js';

const router = express.Router();

var collection;

getDb().then((db) => {
  collection = db.collection('User');
});

// getting all users from database
router.get('/', async (req, res) => {
  try {
    const users = await collection.find({}).toArray();
    res.status(200).json(users)
  } catch (error) {
    console.log(`Error while fetching users from database: `, error)
  }
})

// accepting friend request
router.patch('/acceptRequest/:id', async (req, res) => {
  const { currentUser, friendUser } = req.body; // assuming currentUser and friendUser contain their respective IDs
  // console.log(currentUser)
  // console.log(friendUser)

  try {

    const friendUserId = await collection.findOne({ id: friendUser });
    const currentUserId = await collection.findOne({ id: currentUser });

    // console.log(friendUserId)
    // console.log(currentUserId)

    if (!friendUserId || !currentUserId) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    // Update currentUser's requestSentPeople array
    await collection.updateOne(
      { id: currentUser },
      {
        $addToSet: { connectedPeople: friendUser }, // Add to array if not already present
        $pull: { requestReceivedPeople: friendUser }
      }, // Remove friendUser from the array of requestRecievedPeople of currentUser
      { returnOriginal: false }, // Return the updated document
    );

    // Update friendUser's requestReceivedPeople array
    await collection.updateOne(
      { id: friendUser },
      {
        $addToSet: { connectedPeople: currentUser }, // Add to array if not already present
        $pull: { requestSentPeople: currentUser }
      }, // Remove currentUser from the array of requestSentPeople of friendUser
      { returnOriginal: false } // Return the updated document
    );

    res.status(200).json({ message: 'Friend request accepted by currentUser ss' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// sending friend request
router.patch('/:id', async (req, res) => {
  const { fromUser, toUser } = req.body; // assuming fromUser and toUser contain their respective IDs
  console.log(`from user: ${fromUser} to user: ${toUser}`);

  try {

    const toUserRequest = await collection.findOne({ id: toUser });
    const fromUserRequested = await collection.findOne({ id: fromUser });

    if (!toUserRequest || !fromUserRequested) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    // Update fromUser's requestSentPeople array
    await collection.updateOne(
      { id: fromUser },
      { $addToSet: { requestSentPeople: toUser } } // Add to array if not already present
    );

    // Update toUser's requestReceivedPeople array
    await collection.updateOne(
      { id: toUser },
      { $addToSet: { requestReceivedPeople: fromUser } } // Add to array if not already present
    );

    res.status(200).json({ message: 'Friend request sent successfully ss' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Create user
router.post('/', async (req, res) => {
  const { username, firstname, lastname, imageUrl, id, email } = req.body[0] || {};

  // console.log(req.body);
  // console.log(username, firstname, lastname, imageUrl, id, email)

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
    }

  } catch (error) {
    console.error('Error creating user:', error); // Use 'error' instead of 'err'
    res.status(500).send('Internal Server Error');
  }
});



// Create users (bulk insert)
router.post('/bulk/:id', async (req, res) => {
  const users = req.body.users || [];


  if (users.length === 0) {
    return res.status(400).json({ message: 'No users received' });
  }

  try {
    const newUsers = users.map(user => ({
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      firstname: user.firstname,
      lastname: user.lastname,
      id: user.id,
      connectedPeople: [],
      requestSentPeople: [],
      requestReceivedPeople: []
    }));

    const existingIds = newUsers.map(user => user.id);

    const existingUsers = await collection.find({ id: { $in: existingIds } }).toArray();

    const existingUserIds = existingUsers.map(user => user.id);
    const usersToInsert = newUsers.filter(user => !existingUserIds.includes(user.id));

    if (usersToInsert.length > 0) {
      const result = await collection.insertMany(usersToInsert);
      res.status(201).json({ message: `${result.insertedCount} users created` });
    } else {
      res.status(200).json({ message: 'All users already exist' });
    }

  } catch (error) {
    console.error('Error creating users:', error);
    res.status(500).send('Internal Server Error');
  }
});




export default router;
