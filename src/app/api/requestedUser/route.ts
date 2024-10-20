import { NextResponse } from "next/server";
import axios from "axios";

interface User {
    username: string;
    imageUrl: string;
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    connectedPeople: string[];
    requestSentPeople: string[];
    requestReceivedPeople: string[];
  }

const baseUrl = "https://mind-maps-backend.onrender.com";
const localUrl = "http://localhost:8080";

export async function GET() {
  try {
    // const response = await axios.get<User[]>(`${baseUrl}/friends`);
    const response = await axios.get<User[]>(`${localUrl}/friends`);
    
    
    const usersMapped = response.data.map(user => {
      return {
        id: user.id,
        username: user.username,
        imageUrl: user.imageUrl,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        connectedPeople: user.connectedPeople,
        requestSentPeople: user.requestSentPeople,
        requestReceivedPeople: user.requestReceivedPeople,
      }
    })
    
    // console.log(usersMapped)
    return NextResponse.json(usersMapped);
  } catch (error) {
    console.log(`error fetching users : ${error}`);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}