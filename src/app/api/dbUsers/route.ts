import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic"

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
const localUrl = "http://localhost:56765";

export async function GET() {
  try {
    const response = await axios.get<User[]>(`${baseUrl}/friends`);

    const usersMapped = response.data.map((user) => ({
      id: user.id,
      username: user.username,
      imageUrl: user.imageUrl,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      connectedPeople: user.connectedPeople,
      requestSentPeople: user.requestSentPeople,
      requestReceivedPeople: user.requestReceivedPeople,
    }));

    const nextResponse = NextResponse.json(usersMapped);
    nextResponse.headers.set("Cache-Control", "no-store");
    return nextResponse;
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}