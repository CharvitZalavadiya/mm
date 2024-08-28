// import mongoose, { Mongoose} from "mongoose";

// interface MongooesConn {
//   conn: Mongoose | null;
//   promise: Promise<Mongoose> | null;
// }

// const MONGODB_URL = process.env.MONGODB_URI!;

// let cached: MongooesConn = (global as any).mongoose;

// if(!cached) {
//   cached = (global as any).mongoose = {
//     conn: null,
//     promise: null
//   }
// }

// export const connect = async () => {
//   if (cached.conn) return cached.conn;

//   cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
//     dbName: 'Mindmaps',
//     bufferCommands: false,
//     connectTimeoutMS: 30000
//   })

//   cached.conn = await cached.promise;

//   console.log(`Mongo Connected !`)

//   return cached.conn;
// }




