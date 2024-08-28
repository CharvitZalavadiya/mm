"use server";

import User from "@/models/User";
// import { connect } from "../lib/db";
import {connectToDatabase, getDb} from "@/server/config/db.js"

export async function createUser(user: any) {
  try {
    // await connect();
    await connectToDatabase();
    const db = getDb();
    const collection = db.collection('Note');
    console.log(`working with ${collection} collection`);
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}
