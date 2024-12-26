import React, { useState } from "react";
import EmojiPicker from "@/components/comps/EmojiPicker";
import axios from "axios"; // Import axios
import { useUserContext } from "@/context/UserContext";

const baseUrl = "https://mind-maps-backend.onrender.com"
const localUrl = "http://localhost:8080"

const ChatSectionInputField: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const { selectedUser, loggedinUser } = useUserContext();

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prevMessage) => prevMessage + emoji); // Append emoji to message
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return; // Do not send empty messages

    // const timestamp = new Date().toISOString(); // Generate timestamp
    const now = new Date();

        // Convert the current UTC time to IST using `toLocaleString` with the 'Asia/Kolkata' timezone
        const istDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

        // Convert IST date to ISO string
        const timestamp = istDate.toISOString(); // Format as ISO string in IST

        console.log("Generated IST Timestamp:", timestamp);


    try {
      // Send the message to the backend using axios
      await axios.post(`${localUrl}/chat/sendMessage`, {
        from: loggedinUser?.id, // Sender's user ID
        to: selectedUser?.id, // Receiver's user ID
        content: message, // Message content
        timestamp: timestamp, // Timestamp
      });

      // Optionally, clear the message input field after sending
      // setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && message.trim() !== "") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center">
      <EmojiPicker onEmojiSelect={handleEmojiSelect} />
      <input
        className="text-slate-200 text-md mx-2 my-2 bg-chatSectionInputField outline-none rounded-md px-3 py-1 flex-grow"
        type="text"
        placeholder="Type a message ..."
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Update message state
        onKeyDown={handleKeyPress} // Handle Enter key press
      />
      <button className="outline-none" onClick={handleSendMessage}>
        <span className="material-symbols-rounded mr-2 flex px-3 py-[6px] items-center bg-chatSectionInputField rounded-md">
          send
        </span>
      </button>
    </div>
  );
};

export default ChatSectionInputField;
