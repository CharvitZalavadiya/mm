import mongoose from "mongoose";

// Message schema definition
const MessageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically sets the current date/time if not provided
      required: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create and export the Message model
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export default Message;
