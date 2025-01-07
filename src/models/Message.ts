import mongoose, { Document, Model, Schema } from 'mongoose';

interface IMessage extends Document {
  from: string;
  to: string;
  content: string;
  timestamp: Date;
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
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
