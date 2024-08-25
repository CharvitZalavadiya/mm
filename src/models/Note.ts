import mongoose, { Document, Model, Schema } from 'mongoose';

interface INote extends Document {
  userId: string;
  title: string;
  description: string;
  color: string;
}

const NoteSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'gray',
      required: true,
    },
  },
  { timestamps: true }
);

const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default Note;