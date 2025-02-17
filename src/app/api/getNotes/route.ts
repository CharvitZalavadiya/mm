import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic"; // Prevents static rendering issuescls

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

export async function GET() {
  try {
    const response = await axios.get<Note[]>(`${baseUrl}/notes`);
    
    
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
    
    // const headers = new Headers({
    //   "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    //   Pragma: "no-cache",
    //   Expires: "0",
    // });

    // return NextResponse.json(userNotesMapped, {headers});
    return NextResponse.json(userNotesMapped);
  } catch (error) {
    console.log(`error fetching notes : ${error}`);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}