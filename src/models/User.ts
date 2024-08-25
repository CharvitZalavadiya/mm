// import mongoose, { Document, Model, Schema } from 'mongoose';

// interface IUser extends Document {
//   userName: string;
//   password: string;
//   email: string;
// }

// const UserSchema: Schema = new Schema(
//   {
//     userName: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//   },
//   { timestamps: true }
// );

// UserSchema.pre('save', function(next) {
//   console.log('About to save a note:', this);
//   next();
// });

// const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// UserSchema.post('save', function(doc) {
//   console.log('Saved note:', doc);
// });

// export default User;

import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerckId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  connectedPeople: [{ type: String }],
  requestedPeople: [{ type: String }],
});

const User = models?.User || model("User", UserSchema);

export default User;
