import express from 'express';
import { getDb } from '../config/db.js';

const router = express.Router();

var collection;

getDb().then((db) => {
  collection = db.collection('User');
});

router.get('/', async (req, res) => {
  try {
    const users = await collection.find({}).toArray();
    res.status(200).json(users)
  } catch (error) {
    console.log(`Error while fetching users from database: `, error)
  }
})

router.patch('/acceptRequest/:id', async (req, res) => {
  const { currentUser, friendUser } = req.body;

  try {

    const friendUserId = await collection.findOne({ id: friendUser });
    const currentUserId = await collection.findOne({ id: currentUser });

    if (!friendUserId || !currentUserId) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    await collection.updateOne(
      { id: currentUser },
      {
        $addToSet: { connectedPeople: friendUser },
        $pull: { requestReceivedPeople: friendUser }
      },
      { returnOriginal: false },
    );

    await collection.updateOne(
      { id: friendUser },
      {
        $addToSet: { connectedPeople: currentUser },
        $pull: { requestSentPeople: currentUser }
      },
      { returnOriginal: false }
    );

    res.status(200).json({ message: 'Friend request accepted by currentUser ss' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.patch('/:id', async (req, res) => {
  const { fromUser, toUser } = req.body;
  console.log(`from user: ${fromUser} to user: ${toUser}`);

  try {

    const toUserRequest = await collection.findOne({ id: toUser });
    const fromUserRequested = await collection.findOne({ id: fromUser });

    if (!toUserRequest || !fromUserRequested) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    await collection.updateOne(
      { id: fromUser },
      { $addToSet: { requestSentPeople: toUser } }
    );

    await collection.updateOne(
      { id: toUser },
      { $addToSet: { requestReceivedPeople: fromUser } }
    );

    res.status(200).json({ message: 'Friend request sent successfully ss' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/', async (req, res) => {
  const { username, firstname, lastname, imageUrl, id, email } = req.body[0] || {};

  try {

    const newUser = {
      username,
      email,
      imageUrl,
      firstname,
      lastname,
      id,
      connectedPeople: [],       
      requestSentPeople: [],     
      requestReceivedPeople: []  
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
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
});



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
