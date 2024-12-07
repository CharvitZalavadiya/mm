import express from 'express';
import { getDb } from '../config/db.js';

const router = express.Router();

var collection;

getDb().then((db) => {
    collection = db.collection('User');
});

var currentUserId;

router.post('/friends', (req, res) => {
    try {
        const { userId } = req.body; // Destructure userId from req.body
        currentUserId = userId

        console.log(currentUserId)

        // Now you can use the userId as needed
        res.status(200).json({ message: 'UserId received successfully' });
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/friends/connected', async (req, res) => {
    try {

        if (!currentUserId) {
            return res.status(400).json({ message: 'UserId is required' });
        }
        const users = await collection.find({ connectedPeople: currentUserId }).toArray();
        res.status(200).json(users)
    } catch (error) {
        console.log(`Error while fetching connected users from database: `, error)
    }
})

router.get('/friends/requestSent', async (req, res) => {
    try {

        if (!currentUserId) {
            return res.status(400).json({ message: 'UserId is required' });
        }
        const users = await collection.find({ requestReceivedPeople: currentUserId }).toArray();
        res.status(200).json(users)
    } catch (error) {
        console.log(`Error while fetching requestSent users from database: `, error)
    }
})

router.get('/friends/requestReceived', async (req, res) => {
    try {

        if (!currentUserId) {
            return res.status(400).json({ message: 'UserId is required' });
        }
        const users = await collection.find({ requestSentPeople: currentUserId }).toArray();
        res.status(200).json(users)
    } catch (error) {
        console.log(`Error while fetching requestReceived users from database: `, error)
    }
})

router.get('/friends/notConnected', async (req, res) => {
    try {

        if (!currentUserId) {
            return res.status(400).json({ message: 'UserId is required' });
        }

        const users = await collection.find({
            connectedPeople: { $ne: currentUserId },
            requestReceivedPeople: { $ne: currentUserId},
            requestSentPeople: { $ne: currentUserId}
        }).toArray();

        res.status(200).json(users);
    } catch (error) {
        console.log(`Error while fetching not connected users from database: `, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
