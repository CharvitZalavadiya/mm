import "@/context/UserContext";
import { useUserContext } from "@/context/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";

import EmojiPicker from "@/components/comps/EmojiPicker";

const baseUrl = "https://mind-maps-backend.onrender.com";
const localUrl = "http://localhost:8080";

interface Message {
  from: string;
  to: string;
  content: string;
  timestamp: string;
}

const ChatSectionWithFriends = () => {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  const { selectedUser, loggedinUser } = useUserContext();

  useEffect(() => {
    if (loggedinUser && selectedUser) {
      const bothUserDetails = {
        from: loggedinUser.id,
        to: selectedUser.id,
      };

      try {
        axios
          .post(`${baseUrl}/chat/bothUserDetails`, bothUserDetails)
          .then((response) => {
            console.log(`Both user details sent`);
          })
          .catch((error) => {
            console.log(error.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [loggedinUser, selectedUser]);

  const fetchMessageHistory = () => {
    fetch(`/api/messageHistory`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetching message");
        console.log("Message History : ", response);
        return response.json();
      })
      .then((msgs) => {
        setMessageHistory(msgs);
      })
      .catch((error) => {
        console.log("Failed to fetch message history", error);
      });
  };

  useEffect(() => {
    fetchMessageHistory();
  }, []);

  console.log(messageHistory);

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prevMessage) => prevMessage + emoji); // Append emoji to message
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return; // Do not send empty messages

    // const timestamp = new Date().toISOString(); // Generate timestamp
    const now = new Date();

    // Convert the current UTC time to IST using `toLocaleString` with the 'Asia/Kolkata' timezone
    const istDate = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // Convert IST date to ISO string
    const timestamp = istDate.toISOString(); // Format as ISO string in IST

    console.log("Generated IST Timestamp:", timestamp);

    try {
      // Send the message to the backend using axios
      await axios.post(`${baseUrl}/chat/sendMessage`, {
        from: loggedinUser?.id, // Sender's user ID
        to: selectedUser?.id, // Receiver's user ID
        content: message, // Message content
        timestamp: timestamp, // Timestamp
      });

      if (loggedinUser && selectedUser) {
        setMessageHistory((prevMessages) => [
          ...prevMessages,
          {
            from: loggedinUser.id,
            to: selectedUser.id,
            content: message,
            timestamp,
          },
        ]);
      }

      // Optionally, clear the message input field after sending
      setMessage("");

      // Re-fetch message history after sending
      fetchMessageHistory();
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
    <>
      <div className="py-1 px-3 h-[81vh]">
        {messageHistory.map((msg, index) => (
          <ul
          key={index}
            className={`w-full flex flex-wrap ${
              msg.from === loggedinUser?.id ? "justify-end" : "justify-start"
            }`}
          >
            <li
              key={index}
              className={`border border-chatSectionMessageBorder rounded-md px-3 py-1 my-1 flex max-w-28 text-wrap bg-chatSectionMessageBG ${
                msg.from === loggedinUser?.id ? "justify-end" : "justify-start"
              }`}
            >
              {msg.content}
            </li>
          </ul>
        ))}
        {/* <p className="text-zinc-500 text-xl w-full h-full flex justify-center items-center">
        Share your thoughts with {selectedUser?.username}
      </p> */}
      </div>

      <div className="flex items-center">
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        <input
          className="text-slate-200 text-md mx-2 my-2 bg-chatSectionInputField outline-none rounded-md px-3 py-2 flex-grow"
          type="text"
          placeholder="Type a message ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Update message state
          onKeyDown={handleKeyPress} // Handle Enter key press
        />
        <button className="outline-none" onClick={handleSendMessage}>
          <span className="material-symbols-rounded mr-2 flex px-3 py-2 items-center bg-chatSectionInputField rounded-md">
            send
          </span>
        </button>
      </div>
    </>
  );
};

export default ChatSectionWithFriends;
