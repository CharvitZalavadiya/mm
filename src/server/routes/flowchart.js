import express from 'express';
import { getDb } from '../config/db.js';


const router = express.Router();


var collection;

getDb().then((db) => {
  collection = db.collection('Flowchart');
});

router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-userid'];

    if(!userId) return res.status(400).json({ error: "User ID is required in headers" });

    const user = await collection.findOne({ userId });

    res.status(200).json(user);
  }catch (err) {
    console.log(`Error ocuured while fetching flowchart : `, err);
  }
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
