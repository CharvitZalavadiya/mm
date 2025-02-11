import express from 'express';
import { getDb, ObjectId } from '../config/db.js';
import Flowchart from '../../models/Flowchart.js';


const router = express.Router();


var collection;

getDb().then((db) => {
  collection = db.collection('Flowchart');
});

router.get('/', async (req, res) => {
  res.send('hello from /flowcharts')
})


router.post("/", async (req, res) => {
  const { userId, flowcharts } = req.body;

  if (!userId || !flowcharts || !flowcharts.length) {
    return res.status(400).json({ error: "Invalid request data" });
  }
  try {
    let existingUserFlowchart = await collection.findOne({ userId });

    const newUserFlowchart = { userId: userId, flowcharts: flowcharts }

    if (!existingUserFlowchart) {
      existingUserFlowchart = await collection.insertOne(newUserFlowchart);
      return res.status(201).json({ message: "New flowchart created", data: existingUserFlowchart });
    }

    // If user exists, append new flowchart(s) to their flowcharts array
    const updatedUserFlowchart = await collection.findOneAndUpdate(
      { userId },
      { $push: { flowcharts: { $each: flowcharts } } }, // ✅ Appends multiple flowcharts
      { returnDocument: "after" } // ✅ Returns updated document
    );

    res.status(200).json({ message: "Flowchart added successfully", data: existingUserFlowchart });
  } catch (error) {
    console.error("Error adding flowchart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
