import express from 'express';
import { getDb } from '../config/db.js';


const router = express.Router();


var collection;

getDb().then((db) => {
  collection = db.collection('Flowchart');
});

// fetching the flowcharts
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

// creating a new flowchart
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

// updating the data of the flowchart
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
          // "flowcharts.$.title": flowchartTitle,
          // "flowcharts.$.color": flowchartColor,
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

// updating the title and color of the flowchart
router.patch('/update/:id', async (req, res) => {
  try {
    const {flowchartColor, flowchartTitle, flowchartId, userId} = req.body

    console.log(flowchartColor);
    console.log(flowchartTitle);
    console.log(flowchartId);
    console.log(userId);

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
          // "flowcharts.$.data.nodes": nodes,
          // "flowcharts.$.data.edges": edges
        }
      }
    );
    res.status(200).json({message: "Flowchart updated successfully"})
  } catch (error) {
    res.status(500).json({message: "Error updating the title and color of flowchart"})
  }
})

// deleting the flowchart
// router.delete('/:id', async (req, res) => {
//   try {
//     const { flowchartId, userId} = req.body

//     if (!userId) {
//       return res.status(400).json({ message: "Did not able to recieved the userId in backend" });
//     } else if (!flowchartId) {
//       return res.status(400).json({ message: "Did not able to recieved the flowchartId details in backend" });
//     }

//     const user = await collection.findOne({ userId: userId });

//     if (!user) {
//       return res.status(404).json({ message: "User not found in db" });
//     }

//     const flowchartIndex = user.flowcharts.findIndex(fc => fc.uniqueId === flowchartId);

//     if (flowchartIndex === -1) {
//       return res.status(404).json({ message: "Flowchart not found for this user" });
//     }
    
//     await collection.updateOne(
//       { userId },
//       { $pull: { flowcharts: { uniqueId: flowchartId } } }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).json({ message: "Flowchart not found or already deleted." });
//     }

//     res.status(200).json({message: "Flowchart deleted successfully"})
//   } catch (error) {
//     res.status(500).json({message: "Error deleting the flowchart"})
//   }
// })


router.delete("/:flowchartId", async (req, res) => {
  try {
    const { flowchartId } = req.params; // Flowchart ID from URL params
    const { userId } = req.body; // User ID from request body

    // Validate inputs
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    if (!flowchartId) {
      return res.status(400).json({ message: "Flowchart ID is required." });
    }

    // Find the user
    const user = await collection.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found in the database." });
    }

    // Check if the flowchart exists for this user
    const flowchartExists = user.flowcharts.some((fc) => fc.uniqueId === flowchartId);

    if (!flowchartExists) {
      return res.status(404).json({ message: "Flowchart not found for this user." });
    }

    // Delete the flowchart from the array
    const result = await collection.updateOne(
      { userId },
      { $pull: { flowcharts: { uniqueId: flowchartId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Flowchart was not deleted (already removed or not found)." });
    }

    res.status(200).json({ message: "Flowchart deleted successfully." });
  } catch (error) {
    console.error("Error deleting flowchart:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


export default router;
