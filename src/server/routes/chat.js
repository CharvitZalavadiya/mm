import express from 'express';
import Message from '../../models/Message.js'; // Import the Message model
import { getDb } from '../config/db.js';

const router = express.Router();

var collection;
var currentUserId;
var selectedUserId;

getDb().then((db) => {
    collection = db.collection('Chat');
});

router.post('/bothUserDetails', async (req, res) => {
    try {
        const { from, to } = req.body;
        currentUserId = from
        selectedUserId = to

        if (!selectedUserId) {
            return res.status(400).json({ message: 'UserId is required for selectedUser' });
        }

        res.status(200).json({ message: 'UserId received successfully' });
    } catch (error) {
        console.error('Error fetching current user or selected user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST route to handle sending a message
router.post('/sendMessage', async (req, res) => {
    const { from, to, content, timestamp } = req.body; // Extract data from the request body

    // Validation: Ensure that all required fields are present
    if (!from || !to || !content || !timestamp) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Create a new message and save it to the database
        const newMessage = new Message({
            from,
            to,
            content,
            timestamp,
        });

        // await newMessage.save(); // Save the message to MongoDB

        const result = await collection.insertOne(newMessage);
        res.status(201).json(result);
        console.log(`New Message created: ${newMessage}`);

        // Respond with a success message
        console.log({ message: "Message sent successfully" });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

router.get('/fetchMessages', async (req, res) => {
    try {
        console.log(`currentUserId : ${currentUserId}`)
        console.log(`selectedUserId : ${selectedUserId}`)
        const chats = await collection.find({ from: currentUserId, to: selectedUserId }).toArray();
        res.status(200).json(chats)
    } catch (error) {
        console.log(`Error while fetching chats from database: `, error)
    }
})

export default router;
