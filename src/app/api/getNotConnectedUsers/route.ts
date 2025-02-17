import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Prevents static rendering issuescls

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
    // const res = await fetch(`${baseUrl}/api/friends/notConnected`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   cache: "no-store",
    // });
    const res = await fetch(`${baseUrl}/api/friends/notConnected`);

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
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

    // const headers = new Headers({
    //   "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    //   Pragma: "no-cache",
    //   Expires: "0",
    // });

    // return NextResponse.json(usersMapped, { headers });
    return NextResponse.json(usersMapped);
  } catch (error) {
    console.error(`Error fetching users getNotConnected:`, error);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}
