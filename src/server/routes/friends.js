import express from 'express';
import { getDb } from '../config/db.js';

const router = express.Router();

// Sending friends request
router.post('/:id', async (req, res) => {
  const { fromUser, toUser } = req.body;
  console.log(`from user: ${fromUser} to user: ${toUser}`);
  // Add your implementation here
});

// Create user
router.post('/', async (req, res) => {
  const { username, firstname, lastname, imageUrl, id, email } = req.body[0];
  // console.log(`${firstname} ${lastname} ${email} ${imageUrl} ${username} ${id}`);
  try {
    const db = getDb();
    const collection = db.collection('User');
    const newUser = {username, email, imageUrl, firstname, lastname, id};
    const result = await collection.insertOne(newUser);
    res.status(201).json(result)
  } catch (error) {
    console.error('Error creating user:', err);
    res.status(500).send('Internal Server Error');
  }
})

export default router;
