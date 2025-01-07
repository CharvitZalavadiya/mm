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
  connectedPeople: {
    type: [String],
    default: [],
  },
  requestSentPeople: {
    type: [String],
    default: [],
  },
  requestReceivedPeople: {
    type: [String],
    default: [],
  },  
});

const User = models?.User || model("User", UserSchema);

export default User;
