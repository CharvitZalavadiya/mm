"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import TopBarNotes from "@/layout/topbarNotes/page";

interface Note {
  _id: string;
  id: string;
  title: string;
  description: string;
  color: string;
  userId: string;
}

const baseUrl = "https://mind-maps-backend.onrender.com";
const localUrl = "http://localhost:56765";

const UserNotes: React.FC = () => {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const popupRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { userId } = useAuth();

  useEffect(() => {
    if(userId) localStorage.setItem("userId", userId);
    const fetchNotes = async () => {
      try {
        const response = await fetch("/api/getNotes", { cache: 'no-store' });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data: Note[] = await response.json();
        setNotes(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [userId]);

  useEffect(() => {
    const filteredNotesBasedOnUser = notes.filter(
      (note) => note.userId === userId
    );
    setFilteredNotes(
      filteredNotesBasedOnUser.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (note.color === selectedColor || selectedColor === "black")
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
    setSelectedColor("black");
  };

  const handleSaveChanges = async () => {
    if (!selectedNote) return;

    try {
      const updatedNote = {
        ...selectedNote,
        title: editedTitle,
        description: editedDescription,
        color: selectedColor,
      };

      await axios.post(
        `${baseUrl}/notes/${selectedNote._id}`,
        updatedNote
      );

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        )
      );

      setSelectedColor("black");

      closePopup();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;

    try {
      await axios.delete(
        `${baseUrl}/notes/${selectedNote._id}`
      );
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== selectedNote._id)
      );

      setSelectedColor("black");

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
      title: "New Note Title",
      description: "New Note Description",
      color: selectedColor || "gray",
    };
    
    try {
      const response = await axios.post<Note>(
        `${baseUrl}/notes`,
        newNote
      );
      const createdNote = response.data;
      setNotes((prevNotes) => [...prevNotes, createdNote]);
      setFilteredNotes((prevNotes) => [...prevNotes, createdNote]);
      openPopup(createdNote);
    } catch (error) {
      console.error("Error creating new note:", error);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <main className="cssMainCompNotes bg-sidebarGradient rounded-lg tracking-wide leading-relaxed h-[95dvh] overflow-y-scroll p-5 ml-3 w-full">
        <span className="top-0 sticky">
          <TopBarNotes
            onSearch={handleSearch}
            onCreateNote={handleCreateNewNote}
            onColorChange={handleColorChange}
            selectedColor={selectedColor}
            onToggleSidebar={handleToggleSidebar}
          />
        </span>

        <span>
          <ul className="cssNotesGrid grid grid-cols-4 gap-4 max-h-full overflow-y-scroll">
            {filteredNotes.map((note) => (
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
            ))}
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
              <div className="cssNotePopupNotText flex h-[10%]">
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

                <span className="cssNotePopupButtons flex justify-between w-1/2">
                  <button
                    onClick={handleDeleteNote}
                    className="cssNotePopupDeleteBtn bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="cssNotePopupSaveBtn bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={closePopup}
                    className="cssNotePopupCancelBtn bg-gray-300 text-gray-700 px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default UserNotes;
