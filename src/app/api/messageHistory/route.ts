// import { NextResponse } from "next/server";
// import axios from "axios";

// // Define the Message interface
// interface Message {
//   from: string;
//   to: string;
//   content: string;
//   timestamp: string;
// }

// // Define API base URLs
// const baseUrl = "https://mind-maps-backend.onrender.com";
// const localUrl = "http://localhost:8080";

// // Fetch users from the backend API
// export async function GET() {
//   try {
//     // Replace with the correct API URL based on environment
//     const response = await axios.get<Message[]>(`${baseUrl}/chat/fetchMessages`);

//     // Map the response data
//     const messagesMapped = response.data.map((msg) => ({
//       from: msg?.from,
//       to: msg?.to,
//       content: msg?.content,
//       timestamp: msg?.timestamp
//     }));

//     // Return the response with no-cache headers
//     const nextResponse = NextResponse.json(messagesMapped);
//     nextResponse.headers.set("Cache-Control", "no-store");
//     return nextResponse;
//   } catch (error) {
//     console.error(`Error fetching messages: ${error}`);
//     return new NextResponse("Failed to fetch messages", { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import axios from "axios";

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

// Fetch users from the backend API
export async function GET() {
  try {
    // Replace with the correct API URL based on environment
    const response = await axios.get<Message[]>(`${baseUrl}/chat/fetchMessages`, {
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    // Map the response data
    const messagesMapped = response.data.map((msg) => ({
      from: msg?.from,
      to: msg?.to,
      content: msg?.content,
      timestamp: msg?.timestamp
    }));

    // Return the response with no-cache headers

    const headers = new Headers({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    const nextResponse = NextResponse.json(messagesMapped, {headers});
    // nextResponse.headers.set("Cache-Control", "no-store");
    // nextResponse.headers.set("Pragma", "no-cache");
    // nextResponse.headers.set("Expires", "0");
    
    return nextResponse;
  } catch (error) {
    console.error(`Error fetching messages: ${error}`);
    return new NextResponse("Failed to fetch messages", { status: 500 });
  }
}
