// import "@/context/UserContext";
// import { useUserContext } from "@/context/UserContext";
// import axios from "axios";
// import { useEffect, useState } from "react";

// import EmojiPicker from "@/components/comps/EmojiPicker";

// const baseUrl = "https://mind-maps-backend.onrender.com";
// const localUrl = "http://localhost:8080";

// interface Message {
//   from: string;
//   to: string;
//   content: string;
//   timestamp: string;
// }

// const ChatSectionWithFriends = () => {
//   const [messageHistory, setMessageHistory] = useState<Message[]>([]);
//   const [message, setMessage] = useState<string>("");

//   const { selectedUser, loggedinUser } = useUserContext();

//   useEffect(() => {
//     if (loggedinUser && selectedUser) {
//       const bothUserDetails = {
//         from: loggedinUser.id,
//         to: selectedUser.id,
//       };

//       try {
//         axios
//           .post(`${baseUrl}/chat/bothUserDetails`, bothUserDetails)
//           .then((response) => {
//             console.log(`Both user details sent`);
//           })
//           .catch((error) => {
//             console.log(error.message);
//           });
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   }, [loggedinUser, selectedUser]);

//   const fetchMessageHistory = () => {
//     fetch(`/api/messageHistory`)
//       .then((response) => {
//         if (!response.ok) throw new Error("Failed to fetching message");
//         console.log("Message History : ", response);
//         return response.json();
//       })
//       .then((msgs) => {
//         setMessageHistory(msgs);
//       })
//       .catch((error) => {
//         console.log("Failed to fetch message history", error);
//       });
//   };

//   useEffect(() => {
//     fetchMessageHistory();
//   }, []);

//   console.log(messageHistory);

//   const handleEmojiSelect = (emoji: string) => {
//     setMessage((prevMessage) => prevMessage + emoji); // Append emoji to message
//   };

//   const handleSendMessage = async () => {
//     if (message.trim() === "") return; // Do not send empty messages

//     // const timestamp = new Date().toISOString(); // Generate timestamp
//     const now = new Date();

//     // Convert the current UTC time to IST using `toLocaleString` with the 'Asia/Kolkata' timezone
//     const istDate = new Date(
//       now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//     );

//     // Convert IST date to ISO string
//     const timestamp = istDate.toISOString(); // Format as ISO string in IST

//     console.log("Generated IST Timestamp:", timestamp);

//     try {
//       // Send the message to the backend using axios
//       await axios.post(`${baseUrl}/chat/sendMessage`, {
//         from: loggedinUser?.id, // Sender's user ID
//         to: selectedUser?.id, // Receiver's user ID
//         content: message, // Message content
//         timestamp: timestamp, // Timestamp
//       });

//       if (loggedinUser && selectedUser) {
//         setMessageHistory((prevMessages) => [
//           ...prevMessages,
//           {
//             from: loggedinUser.id,
//             to: selectedUser.id,
//             content: message,
//             timestamp,
//           },
//         ]);
//       }

//       // Optionally, clear the message input field after sending
//       setMessage("");

//       // Re-fetch message history after sending
//       fetchMessageHistory();
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const handleKeyPress = (event: React.KeyboardEvent) => {
//     if (event.key === "Enter" && message.trim() !== "") {
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="h-[calc(95vh-7rem)]">
//       <section className="py-1 px-3 h-full overflow-scroll">
//         {messageHistory.map((msg, index) => (
//           <ul
//             key={index}
//             className={`w-full flex flex-wrap ${
//               msg.from === loggedinUser?.id ? "justify-end" : "justify-start"
//             }`}
//           >
//             <li
//               key={index}
//               className={`border border-chatSectionMessageBorder rounded-lg px-3 py-1 my-1 max-w-[60%] bg-chatSectionMessageBG ${
//                 msg.from === loggedinUser?.id ? "justify-end" : "justify-start"
//               } break-words overflow-hidden`}
//             >
//               {msg.content}
//             </li>
//           </ul>
//         ))}
//         {/* <p className="text-zinc-500 text-xl w-full h-full flex justify-center items-center">
//         Share your thoughts with {selectedUser?.username}
//       </p> */}
//       </section>

//       <section className="flex items-center h-14">
//         <EmojiPicker onEmojiSelect={handleEmojiSelect} />
//         <input
//           className="text-slate-200 text-md mx-2 my-2 bg-chatSectionInputField outline-none rounded-md px-3 py-2 flex-grow"
//           type="text"
//           placeholder="Type a message ..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)} // Update message state
//           onKeyDown={handleKeyPress} // Handle Enter key press
//         />
//         <button className="outline-none" onClick={handleSendMessage}>
//           <span className="material-symbols-rounded mr-2 flex px-3 py-[9px] items-center bg-chatSectionInputField rounded-md">
//             send
//           </span>
//         </button>
//       </section>
//     </div>
//   );
// };

// export default ChatSectionWithFriends;
























import "@/context/UserContext";
import { useUserContext } from "@/context/UserContext";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "./responsive.css"

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference to scroll to the bottom

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
        if (!response.ok) throw new Error("Failed to fetch messages");
        return response.json();
      })
      .then((msgs) => {
        const sortedMessages = msgs.sort((a: Message, b: Message) => {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });
        setMessageHistory(sortedMessages);
      })
      .catch((error) => {
        console.log("Failed to fetch message history", error);
      });
  };

  useEffect(() => {
    fetchMessageHistory();
  }, []);

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prevMessage) => prevMessage + emoji); // Append emoji to message
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return; // Do not send empty messages

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

      // Clear the message input field after sending
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

  // Function to format the timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-IN", options); // Customize date format as per your needs
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groupedMessages: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
      const date = new Date(msg.timestamp);
      const dateKey = date.toLocaleDateString(); // Use the date only (e.g., "Dec 26, 2024")
      if (!groupedMessages[dateKey]) {
        groupedMessages[dateKey] = [];
      }
      groupedMessages[dateKey].push(msg);
    });
    return groupedMessages;
  };

  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-IN", options);
  };

  // Get grouped messages
  const groupedMessages = groupMessagesByDate(messageHistory);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to bottom when message history updates
    }
  }, [messageHistory]);

  return (
    <div className="h-[calc(95vh-7rem)]">
      <section className="py-1 px-3 h-full overflow-scroll">
        {/* Iterate over grouped messages */}
        {Object.keys(groupedMessages).map((date, index) => (
          <div key={index}>
            {/* Date Tag */}
            <div className="flex justify-center">
              <span className="text-sm flex justify-center font-medium w-fit text-gray-100 bg-noteBackgroundCyan border border-noteBorderCyan rounded-full py-1 px-4 my-3">
                {formatDate(groupedMessages[date][0].timestamp)}{" "}
                {/* Display date */}
              </span>
            </div>

            {/* Messages for the specific date */}
            {groupedMessages[date].map((msg, index) => (
              <ul
                key={index}
                className={`w-full flex flex-wrap ${
                  msg.from === loggedinUser?.id ? "justify-end" : "justify-start"
                }`}
              >
                <li
                  className={`border border-chatSectionMessageBorder text-smFont rounded-lg px-3 py-1 my-1 max-w-[60%] bg-chatSectionMessageBG ${
                    msg.from === loggedinUser?.id ? "justify-end" : "justify-start"
                  } break-words overflow-hidden`}
                >
                  <div className="cssChatMessageMessage">{msg.content}</div>
                  <div className="cssChatMessageTime text-xs text-gray-400 flex items-end justify-end text-end mt-1 font-light select-none">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    {/* Display only time */}
                  </div>
                </li>
              </ul>
            ))}
          </div>
        ))}

        {/* Placeholder to scroll to bottom */}
        <div ref={messagesEndRef} />
      </section>

      <section className="flex items-center h-14">
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        <input
          className="cssChatInputSection text-slate-200 text-md mx-2 my-2 bg-chatSectionInputField outline-none rounded-md px-3 py-2 flex-grow"
          type="text"
          placeholder="Type a message ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Update message state
          onKeyDown={handleKeyPress} // Handle Enter key press
        />
        <button className="outline-none" onClick={handleSendMessage}>
          <span className="cssChatSendButton material-symbols-rounded mr-3 flex px-3 py-[9px] items-center bg-chatSectionInputField rounded-md">
            send
          </span>
        </button>
      </section>
    </div>
  );
};

export default ChatSectionWithFriends;
