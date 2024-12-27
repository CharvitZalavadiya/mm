// import { NextResponse } from "next/server";
// import axios from "axios";

// // Define the User interface
// interface User {
//   username: string;
//   imageUrl: string;
//   id: string;
//   email: string;
//   firstname: string;
//   lastname: string;
//   connectedPeople: string[];
//   requestSentPeople: string[];
//   requestReceivedPeople: string[];
// }

// // Define API base URLs
// const baseUrl = "https://mind-maps-backend.onrender.com";
// const localUrl = "http://localhost:8080";

// // Fetch users from the backend API
// export async function GET() {
//   try {
//     // Replace with the correct API URL based on environment
//     const response = await axios.get<User[]>(`${baseUrl}/api/friends/requestReceived`);

//     // Map the response data
//     const usersMapped = response.data.map((user) => ({
//       id: user.id,
//       username: user.username,
//       imageUrl: user.imageUrl,
//       email: user.email,
//       firstname: user.firstname,
//       lastname: user.lastname,
//       connectedPeople: user.connectedPeople,
//       requestSentPeople: user.requestSentPeople,
//       requestReceivedPeople: user.requestReceivedPeople,
//     }));

//     // Return the response with no-cache headers

//     const headers = new Headers({
//       "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
//       Pragma: "no-cache",
//       Expires: "0",
//     });

//     const nextResponse = NextResponse.json(usersMapped, {headers});
//     // nextResponse.headers.set("Cache-Control", "no-store");
//     return nextResponse;
//   } catch (error) {
//     console.error(`Error fetching users: ${error}`);
//     return new NextResponse("Failed to fetch users", { status: 500 });
//   }
// }






import { NextResponse } from "next/server";

// Define the User interface
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

// Define API base URLs
const baseUrl = "https://mind-maps-backend.onrender.com";
const localUrl = "http://localhost:8080";

// Fetch users from the backend API using fetch
export async function GET() {
  try {
    // Replace with the correct API URL based on environment
    const response = await fetch(`${baseUrl}/api/friends/requestReceived`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    // Parse the response JSON
    const users: User[] = await response.json();

    // Map the response data
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

    // Return the response with no-cache headers
    const headers = new Headers({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    const nextResponse = NextResponse.json(usersMapped, { headers });
    return nextResponse;
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}
