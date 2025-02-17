import { NextResponse } from "next/server";

interface Message {
  from: string;
  to: string;
  content: string;
  timestamp: string;
}

const baseUrl = "https://mind-maps-backend.onrender.com";
const localUrl = "http://localhost:8080";

export async function GET() {
  try {
    // const response = await fetch(`${baseUrl}/chat/fetchMessages`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   cache: "no-store",
    // });
    const response = await fetch(`${baseUrl}/chat/fetchMessages`);

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    const messages: Message[] = await response.json();

    const messagesMapped = messages.map((msg) => ({
      from: msg.from,
      to: msg.to,
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    // const headers = new Headers({
    //   "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    //   Pragma: "no-cache",
    //   Expires: "0",
    // });

    // const nextResponse = NextResponse.json(messagesMapped, { headers });
    const nextResponse = NextResponse.json(messagesMapped);
    return nextResponse;
  } catch (error) {
    console.error(`Error fetching messages: ${error}`);
    return new NextResponse("Failed to fetch messages", { status: 500 });
  }
}