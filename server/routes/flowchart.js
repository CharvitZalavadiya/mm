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

    if (!userId) return res.status(400).json({ error: "User ID is required in headers" });

    const user = await collection.findOne({ userId });

    res.status(200).json(user);
  } catch (err) {
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

router.patch("/:id", async (req, res) => {
  try {
    const { nodes, edges, flowchartColor, flowchartId, flowchartTitle, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Did not able to recieved the userId in backend" });
    } else if (!flowchartId || !flowchartTitle || !flowchartColor) {
      return res.status(400).json({ message: "Did not able to recieved the flowchart details in backend" });
    }

    const user = await collection.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found in db" });
    }

    const flowchartIndex = user.flowcharts.findIndex(fc => fc.uniqueId === flowchartId);

    if (flowchartIndex === -1) {
      return res.status(404).json({ message: "Flowchart not found for this user" });
    }
    
    await collection.updateOne(
      { userId, "flowcharts.uniqueId": flowchartId },
      {
        $set: {
          "flowcharts.$.title": flowchartTitle,
          "flowcharts.$.color": flowchartColor,
          "flowcharts.$.data.nodes": nodes,
          "flowcharts.$.data.edges": edges
        }
      }
    );

    res.status(200).json({ message: "Flowchart updated successfully", updatedFlowchart: user.flowcharts[flowchartIndex] });
  } catch (error) {
    console.error("Error updating flowchart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

export default router;
