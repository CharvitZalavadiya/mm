"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import axios from "axios";
import SideBar from "@/layout/sidebar/page";
import TopBarNotes from "@/layout/topbarNotes/page";
import { useAuth } from "@clerk/nextjs";
import "./responsive.css";
import NotesLoadingSkeleton from "./notesLoadingSkeleton";
import "./animations.css"
import { decryptData, encryptData } from "@/utils/cryptojs";

interface Note {
  _id: string;
  id: string;
  title: string;
  description: string;
  color: string;
  userId: string | null;
}

const baseUrl = "https://mind-maps-backend.onrender.com";
  const localUrl = "http://localhost:8080";

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("allColor");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const popupRef = useRef<HTMLDivElement>(null);

  const { userId } = useAuth();


  useEffect(() => {
    // Fetching the details
    const fetchNotes = async () => {
      try {
        // const response = await fetch("/api/getNotes");
        const response = await fetch(`${baseUrl}/notes`, { cache: 'no-store' });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data: Note[] = await response.json();

        const decryptedNotes = data.map((note) => ({
          ...note,
          title: decryptData(note.title), // Decrypt title
          description: decryptData(note.description), // Decrypt description
          color: decryptData(note.color), // Decrypt color for frontend
        }));
  
        setNotes(decryptedNotes);

      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchNotes();
    }
  }, [userId]);

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    if (isSidebarVisible) {
      setIsSidebarVisible(false);
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Filter notes based on search query and selected color
    const filteredNotesBasedOnUser = notes.filter(
      (note) => note.userId === userId
    );

    setFilteredNotes(
      filteredNotesBasedOnUser.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (note.color === selectedColor || selectedColor === "allColor")
      )
    );
  }, [searchQuery, notes, selectedColor, userId]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    if (selectedNote) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedNote]);

  const colorArray = [
    "pink",
    "green",
    "yellow",
    "purple",
    "red",
    "cyan",
    "gray",
  ];

  const returnBg = (pickColor: string) => {
    switch (pickColor) {
      case "pink":
        return "bg-pink-500/20 border-pink-500 hover:bg-pink-500/30";
      case "green":
        return "bg-green-500/20 border-green-500 hover:bg-green-500/30";
      case "yellow":
        return "bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30 ";
      case "purple":
        return "bg-purple-500/20 border-purple-500 hover:bg-purple-500/30";
      case "red":
        return "bg-red-500/20 border-red-500 hover:bg-red-500/30";
      case "cyan":
        return "bg-cyan-500/20 border-cyan-500 hover:bg-cyan-500/30";
      case "gray":
        return "bg-gray-500/20 border-gray-500 hover:bg-gray-500/30";
      default:
        return "";
    }
  };

  const returnBgforPopup = (pickColor: string) => {
    switch (pickColor) {
      case "pink":
        return "bg-pink-500/40 border-pink-500 hover:bg-pink-500/60";
      case "green":
        return "bg-green-500/40 border-green-500 hover:bg-green-500/60";
      case "yellow":
        return "bg-yellow-500/40 border-yellow-500 hover:bg-yellow-500/60 ";
      case "purple":
        return "bg-purple-500/40 border-purple-500 hover:bg-purple-500/60";
      case "red":
        return "bg-red-500/40 border-red-500 hover:bg-red-500/60";
      case "cyan":
        return "bg-cyan-500/40 border-cyan-500 hover:bg-cyan-500/60";
      case "gray":
        return "bg-gray-500/40 border-gray-500 hover:bg-gray-500/60";
      default:
        return "";
    }
  };

  // // const sidebarComp = useMemo(() => <SideBar />, []);

  const openPopup = (note: Note) => {
    setSelectedNote(note);
    setEditedTitle(note.title);
    setEditedDescription(note.description);
    setSelectedColor(note.color);
  };

  const closePopup = () => {
    setSelectedNote(null);
    setEditedTitle("");
    setEditedDescription("");
    setSelectedColor("allColor");
  };

  const handleSaveChanges = async () => {
    if (!selectedNote) return;

    try {
      const updatedNote = {
        ...selectedNote,
        title: encryptData(editedTitle),
        description: encryptData(editedDescription),
        color: encryptData(selectedColor),
      };

      await axios.patch(
        `${baseUrl}/notes/${selectedNote._id}`,
        updatedNote
      );

      // Update notes and reset filteredNotes to include all notes

      const decryptedUpdatedNote = {
        ...updatedNote,
        title: decryptData(updatedNote.title),
        description: decryptData(updatedNote.description),
        color: decryptData(updatedNote.color), // Decrypt color for frontend
      };
      
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === decryptedUpdatedNote._id ? decryptedUpdatedNote : note
        )
      );

      setSelectedColor("allColor");

      closePopup();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;

    try {
      await axios.delete(`${baseUrl}/notes/${selectedNote._id}`);
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== selectedNote._id)
      );

      setSelectedColor("allColor");

      closePopup();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };


  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateNewNote = async () => {

    const newNote = {
      userId: userId,
      title: encryptData("Title"),
      description: encryptData("Note"),
      color: selectedColor === "allColor" ? encryptData("gray") : encryptData(selectedColor),
    };
  
    try {
      console.log(newNote)
      const response = await axios.post<Note>(`${baseUrl}/notes/`, newNote);
      const createdNote = response.data;

      const decryptedNote = {
        ...createdNote,
        title: decryptData(createdNote.title), // Decrypt title for frontend
        description: decryptData(createdNote.description), // Decrypt description for frontend
        color: decryptData(createdNote.color), // Decrypt color for frontend
      };
            
      setNotes((prevNotes) => [...prevNotes, decryptedNote]);
      setFilteredNotes((prevNotes) => [...prevNotes, decryptedNote]);
      
      
      openPopup(decryptedNote);
    } catch (error) {
      console.error("Error creating new note:", error);
    }finally{

      const responsenew = await fetch(`${baseUrl}/notes`, { cache: 'no-store' });
  
      if (!responsenew.ok) throw new Error("Failed to fetch users");
  
      const data: Note[] = await responsenew.json();
      // console.log(data)
      // setNotes(data);

      const decryptedNotes = data.map((note) => ({
        ...note,
        title: decryptData(note.title), // Decrypt title
        description: decryptData(note.description), // Decrypt description
        color: decryptData(note.color), // Decrypt color for frontend
      }));

      setNotes(decryptedNotes);
    }
  };
  

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="flex justify-end w-screen p-3">
      <span>
        <Suspense fallback="siiiiiiiiii">
          {/* {isSidebarVisible && sidebarComp} */}
          {isSidebarVisible && (
            <SideBar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
          )}
        </Suspense>
      </span>

      <main className="cssMainCompNotes bg-sidebarGradient rounded-lg tracking-wide leading-relaxed h-[95vh] overflow-y-scroll p-5 ml-3 w-full">
        <span className="top-0 sticky">
          <TopBarNotes
            onSearch={handleSearch}
            onCreateNote={handleCreateNewNote}
            onColorChange={handleColorChange}
            selectedColor={selectedColor} // Pass the current selected color to TopBar
            onToggleSidebar={handleToggleSidebar}
          />
        </span>
        <span>
          <ul className="cssNotesGrid grid grid-cols-4 gap-4 max-h-full overflow-y-scroll">
            {loading ? (
              <NotesLoadingSkeleton />
            ) : filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <li
                  key={note._id}
                  onClick={() => openPopup(note)}
                  className={`${returnBg(
                    note.color
                  )} border w-46 h-32 rounded-lg p-4 select-none cursor-pointer hover:bg-opacity-50`}
                >
                  <h4 className="text-slate-200 font-semibold text-lgFont relative top-1/3 w-3/5 h-10 truncate">
                    {note.title}
                  </h4>
                  <p className="text-slate-400 h-7 w-full relative top-1/3 truncate">
                    {note.description}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-mdFont text-slate-400 w-[72vw] flex items-center">Start taking notes by clicking + icon</p>
            )}
          </ul>
        </span>

        {selectedNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              ref={popupRef}
              className="bg-noteEditMode backdrop-blur-md rounded-lg p-6 w-2/3 h-3/4"
            >
              <div className="cssNotePopupText h-[90%]">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full mb-4 text-xl font-bold px-3 focus:outline-none py-2 bg-transparent rounded"
                  placeholder="Title"
                />
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full mb-4 px-3 py-2 border-none focus:outline-none rounded bg-transparent"
                  rows={4}
                  style={{ width: "100%", height: "80%", resize: "none" }}
                  placeholder="Description"
                />
              </div>
              <div className="cssNotePopupNotText flex items-center h-[8%]">
                <span className="cssNotePopupColors rounded py-1 px-3 w-1/2 overflow-x-auto flex gap-2">
                  {colorArray.map((color) => (
                    <ul className="py-1" key={color}>
                      <li
                        className={`${returnBgforPopup(
                          color
                        )} cssNotePopupColor w-6 h-6 rounded-full hover:cursor-pointer ${
                          color === selectedColor ? "border-2 border-solid" : ""
                        }`}
                        onClick={() => setSelectedColor(color)}
                      ></li>
                    </ul>
                  ))}
                </span>

                <span className="cssNotePopupButtons flex items-center justify-between w-1/2">
                  <button
                    onClick={handleDeleteNote}
                    className="cssNotePopupDeleteBtn h-fit bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="cssNotePopupSaveBtn h-fit bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={closePopup}
                    className="cssNotePopupCancelBtn h-fit bg-gray-300 text-gray-700 px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notes;
