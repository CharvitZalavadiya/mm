import express from 'express';
import { getDb, ObjectId } from '../config/db.js';

const router = express.Router();

// Fetching the notes
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('Note'); // Replace with your collection name
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data');
  }
});

// Creating a new note
router.post('/', async (req, res) => {
  const { title, description, color, userId } = req.body;

  if (!title || !description || !userId) {
    return res.status(400).send({ message: 'Title, description, and userId are required' });
  }

  try {
    const db = getDb();
    const collection = db.collection('Note'); // Replace with your collection name
    const newNote = { title, description, color, userId };
    const result = await collection.insertOne(newNote);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Updating a note
router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, color } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid note ID' });
  }

  try {
    const db = getDb();
    const collection = db.collection('Note'); // Replace with your collection name
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, description, color } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Note not found' });
    }

    const updatedNote = await collection.findOne({ _id: new ObjectId(id) });
    res.send(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Deleting a note
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid note ID' });
  }

  try {
    const db = getDb();
    const collection = db.collection('Note'); // Replace with your collection name
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Note not found' });
    }

    res.send({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
