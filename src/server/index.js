import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://cz:cz@cluster0.uvhgvjz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db("MindMaps"); // Replace with your database name
    console.log("MongoDB Connected ....");
  } catch (err) {
    console.error("Error connecting to database:", err);
    throw err;
  }
}

const app = express();
app.use(express.json());
app.use(cors());

app.listen(8080, async () => {
  console.log(`Server is running on port 8080`);
  await connectToDatabase();
});

// fetching the notes

app.get("/notes", async (req, res) => {
  try {
    const dbName = getDb();
    console.log(dbN)
    const collection = db.collection("Note"); // Replace with your collection name
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving data");
  }
});

// Creating a new note
app.post("/notes", async (req, res) => {
  const { title, description, color, userId } = req.body;

  if (!title || !description || !userId) {
    return res.status(400).send({ message: "Title, description, and userId are required" });
  }

  try {
    const collection = db.collection("Note"); // Replace with your collection name
    const newNote = {
      title,
      description,
      color,
      userId,
    };

    const result = await collection.insertOne(newNote);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Updating a note
app.post(`/notes/:id`, async (req, res) => {
  const { id } = req.params;
  const { title, description, color } = req.body;
  console.log(id, title, description, color);

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid note ID" });
  }

  try {
    const collection = db.collection("Note"); // Replace with your collection name
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, description, color } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Note not found" });
    }

    const updatedNote = await collection.findOne({ _id: new ObjectId(id) });

    res.send(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Deleting a note
app.delete(`/notes/:id`, async (req, res) => {
  const { id } = req.params;
  console.log("Deleting note with ID:", id);

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid note ID" });
  }

  try {
    const collection = db.collection("Note"); // Replace with your collection name
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Note not found" });
    }

    res.send({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Friends Section

// Sending friends request
app.post('/friends/:id', async (req, res) => {
  const {fromUser, toUser} = req.body

  console.log(`from user: ${fromUser} to user: ${toUser}`)
})


process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await client.close();
  process.exit();
});

process.on("SIGTERM", async () => {
  console.log("Shutting down server...");
  await client.close();
  process.exit();
});
