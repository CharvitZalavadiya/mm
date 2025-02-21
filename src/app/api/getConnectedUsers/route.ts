import { NextResponse } from "next/server";

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

export async function GET() {
  try {
    const res = await fetch(`${baseUrl}/api/friends/connected`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.statusText}`);
    }

    const users: User[] = await res.json();

    const usersMapped = users.map((user) => ({
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

    const headers = new Headers({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    return NextResponse.json(usersMapped, { headers });
  } catch (error) {
    console.error(`Error fetching users:`, error);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}
