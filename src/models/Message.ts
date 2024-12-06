import mongoose, { Document, Model, Schema } from 'mongoose';

interface IMessage extends Document {
  from: string; // Sender's user ID
  to: string;   // Receiver's user ID
  content: string; // Message content
  timestamp: Date; // Time the message was sent
}

const MessageSchema: Schema = new Schema(
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

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
