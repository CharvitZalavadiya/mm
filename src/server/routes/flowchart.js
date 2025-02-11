import express from 'express';
import { getDb, ObjectId } from '../config/db.js';

const router = express.Router();


var collection;

getDb().then((db) => {
  collection = db.collection('Flowchart');
});

router.post('/', async (req, res) => {
  try {
    const {userId, flowcharts} = req.body

    const data = {userId: userId, flowcharts: flowcharts}

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in fetching flowcharts');
  }
});

export default router;
