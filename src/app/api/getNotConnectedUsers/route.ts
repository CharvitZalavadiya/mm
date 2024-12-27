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
//     const response = await axios.get<User[]>(`${baseUrl}/api/friends/notConnected`);
//     // const response1 = await fetch(`${baseUrl}/api/friends/notConnected`);
//     // console.log(`response1 ====== `, response);

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

// Fetch users from the backend API
export async function GET() {
  try {
    // Fetch data using the native fetch API
    const res = await fetch(`${baseUrl}/api/friends/notConnected`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // This prevents the response from being cached
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    // Parse the JSON response
    const users: User[] = await res.json();

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

    return NextResponse.json(usersMapped, { headers });
  } catch (error) {
    console.error(`Error fetching users:`, error);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}
