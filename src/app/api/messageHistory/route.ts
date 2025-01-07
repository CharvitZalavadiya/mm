import { NextResponse } from "next/server";

// Define the Message interface
interface Message {
  from: string;
  to: string;
  content: string;
  timestamp: string;
}

// Define API base URLs
const baseUrl = "https://mind-maps-backend.onrender.com";
const localUrl = "http://localhost:8080";

// Fetch messages from the backend API using fetch
export async function GET() {
  try {
    // Replace with the correct API URL based on environment
    const response = await fetch(`${baseUrl}/chat/fetchMessages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store",
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    // Parse the response JSON
    const messages: Message[] = await response.json();

    // Map the response data
    const messagesMapped = messages.map((msg) => ({
      from: msg.from,
      to: msg.to,
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    // Return the response with no-cache headers
    const headers = new Headers({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    const nextResponse = NextResponse.json(messagesMapped, { headers });
    return nextResponse;
  } catch (error) {
    console.error(`Error fetching messages: ${error}`);
    return new NextResponse("Failed to fetch messages", { status: 500 });
  }
}

