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














// import { NextResponse } from "next/server";

// // Define the user interface
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

// const baseUrl = "https://mind-maps-backend.onrender.com";
// const localUrl = "http://localhost:8080";

// // Server-side function to fetch users
// export async function GET(request: Request) {
//   try {
//     // Fetching data from the backend API using the native fetch API
//     const response = await fetch(`${baseUrl}/friends`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     // If the response is not OK, throw an error
//     if (!response.ok) {
//       throw new Error(`Failed to fetch users, status: ${response.status}`);
//     }

//     // Parse the JSON response
//     const data: User[] = await response.json();

//     // Map through the response to structure the user data
//     const usersMapped = data.map((user) => ({
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

//     // Return the mapped user data as a JSON response
//     return NextResponse.json(usersMapped);
//   } catch (error) {
//     console.log(`Error fetching users: ${error}`);
//     return new NextResponse("Failed to fetch users", { status: 500 });
//   }
// }
