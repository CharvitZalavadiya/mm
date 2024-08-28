import { NextResponse } from "next/server";
// import { useAuth } from "@clerk/nextjs";
import axios from "axios";

interface Note {
  _id: string;
  id: string;
  title: string;
  description: string;
  color: string;
  userId: string;
}

const baseUrl = "https://mind-maps-backend.onrender.com";
const localUrl = "http://localhost:8080";

// const {userId} = useAuth();

export async function GET() {
  try {
    const response = await axios.get<Note[]>(`${baseUrl}/notes` || `${localUrl}/notes`);
    
    
    const userNotesMapped = response.data.map(note => {
      return {
        _id: note._id,
        id: note.id,
        color: note.color,
        description: note.description,
        title: note.title,
        userId: note.userId,
      }
    })
    
    // console.log(userNotesMapped)
    return NextResponse.json(userNotesMapped);
  } catch (error) {
    console.log(`error fetching notes : ${error}`);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}







// import { NextResponse } from "next/server";

// interface Note {
//   _id: string;
//   id: string;
//   title: string;
//   description: string;
//   color: string;
//   userId: string;
// }

// const baseUrl = "https://mind-maps-backend.onrender.com";
// const localUrl = "http://localhost:8080";

// export async function GET() {
//   try {
//     const res = await fetch(`${baseUrl}/notes` || `${localUrl}/notes`);

//     if (!res.ok) {
//       throw new Error(`Failed to fetch notes, status code: ${res.status}`);
//     }

//     const notes: Note[] = await res.json();

//     const userNotesMapped = notes.map(note => ({
//       _id: note._id,
//       id: note.id,
//       color: note.color,
//       description: note.description,
//       title: note.title,
//       userId: note.userId,
//     }));

//     return NextResponse.json(userNotesMapped);
//   } catch (error) {
//     console.log(`Error fetching notes: ${error}`);
//     return new NextResponse("Failed to fetch notes", { status: 500 });
//   }
// }
