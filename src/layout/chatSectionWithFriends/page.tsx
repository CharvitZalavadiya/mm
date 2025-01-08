import "@/context/UserContext";
import { useUserContext } from "@/context/UserContext";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "./responsive.css";

import EmojiPicker from "@/components/comps/EmojiPicker";
import { decryptData, encryptData } from "@/utils/cryptojs";
import Loading from "./loading";

import io from 'socket.io-client'; // Import socket.io-client


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
  const [loading, setLoading] = useState(true);
  const { selectedUser, loggedinUser } = useUserContext();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const socketRef = useRef<any>(null);  // Reference to the socket
  useEffect(() => {
    if (loggedinUser && selectedUser) {
      const socket = io(`${baseUrl}`); // Connect to Socket.io server

      socketRef.current = socket;

      // Join the chat room for the two users (use user IDs)
      socket.emit('joinChat', { from: loggedinUser.id, to: selectedUser.id });

      // Listen for incoming messages
      socket.on('receiveMessage', (message: Message) => {
        setMessageHistory((prevMessages) => [...prevMessages, message]);
      });

      // Cleanup when the component unmounts
      return () => {
        socket.disconnect();
      };
    }
  }, [loggedinUser, selectedUser]);


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
    setTimeout(() => {
      // setInterval(() => {
        fetch(`${baseUrl}/chat/fetchMessages`, { cache: "no-store" })
          .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch messages");
            return response.json();
          })
          .then((msgs) => {
            const decryptedMessages = msgs.map((msg: Message) => {
              const decryptedContent = decryptData(msg.content);

              return {
                ...msg,
                content: decryptedContent,
              };
            });

            const sortedMessages = decryptedMessages.sort(
              (a: Message, b: Message) => {
                return (
                  new Date(a.timestamp).getTime() -
                  new Date(b.timestamp).getTime()
                );
              }
            );
            setMessageHistory(sortedMessages);
            setLoading(false);
          })
          .catch((error) => {
            console.log("Failed to fetch message history", error);
          });
      // }, 1000);
    }, 1000);
  };

  useEffect(() => {
    fetchMessageHistory();
  }, []);

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prevMessage) => prevMessage + emoji);
  };

  // const handleSendMessage = async () => {
  //   if (message.trim() === "") return;

  //   const now = new Date();

  //   const istDate = new Date(
  //     now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  //   );

  //   const timestamp = istDate.toISOString();

  //   try {
  //     await axios.post(`${baseUrl}/chat/sendMessage`, {
  //       from: loggedinUser?.id,
  //       to: selectedUser?.id,
  //       content: encryptData(message),
  //       timestamp: timestamp,
  //     });

  //     if (loggedinUser && selectedUser) {
  //       setMessageHistory((prevMessages) => [
  //         ...prevMessages,
  //         {
  //           from: loggedinUser.id,
  //           to: selectedUser.id,
  //           content: message,
  //           timestamp,
  //         },
  //       ]);
  //     }

  //     setMessage("");

  //     fetchMessageHistory();
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const now = new Date();
    const istDate = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const timestamp = istDate.toISOString();

    const newMessage = {
      from: loggedinUser?.id,
      to: selectedUser?.id,
      content: encryptData(message),
      timestamp: timestamp,
    };

    // Emit the message to the server via socket
    socketRef.current.emit('sendMessage', newMessage);

    // Update local state for the message
    if(loggedinUser && selectedUser) {

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
    setMessage("");
    fetchMessageHistory();
  };


  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && message.trim() !== "") {
      handleSendMessage();
    }
  };

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
    return date.toLocaleString("en-IN", options);
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groupedMessages: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
      const date = new Date(msg.timestamp);
      const dateKey = date.toLocaleDateString();
      if (!groupedMessages[dateKey]) {
        groupedMessages[dateKey] = [];
      }
      groupedMessages[dateKey].push(msg);
    });
    return groupedMessages;
  };

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

  const groupedMessages = groupMessagesByDate(messageHistory);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageHistory]);

  return (
    <>
      <div className="h-[calc(95vh-7rem)]">
        <section className="py-1 px-3 h-full overflow-scroll">
          {loading ? (
            <Loading />
          ) : (
            Object.keys(groupedMessages).map((date, index) => (
              <div key={index}>
                <div className="flex justify-center">
                  <span className="text-sm flex justify-center font-medium w-fit text-gray-100 bg-noteBackgroundCyan border border-noteBorderCyan rounded-full py-1 px-4 my-3">
                    {formatDate(groupedMessages[date][0].timestamp)}{" "}
                  </span>
                </div>

                {groupedMessages[date].map((msg, index) => (
                  <ul
                    key={index}
                    className={`w-full flex flex-wrap ${
                      msg.from === loggedinUser?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <li
                      className={`border border-chatSectionMessageBorder text-smFont rounded-lg px-3 py-1 my-1 max-w-[60%] bg-chatSectionMessageBG ${
                        msg.from === loggedinUser?.id
                          ? "justify-end"
                          : "justify-start"
                      } break-words overflow-hidden`}
                    >
                      <div className="cssChatMessageMessage">{msg.content}</div>
                      <div className="cssChatMessageTime text-xs text-gray-400 flex items-end justify-end text-end mt-1 font-light select-none">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                      </div>
                    </li>
                  </ul>
                ))}
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </section>

        <section className="flex sticky bottom-1 items-center h-14">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          <input
            className="cssChatInputSection text-slate-200 text-md mx-2 my-2 bg-chatSectionInputField outline-none rounded-md px-3 py-2 flex-grow"
            type="text"
            placeholder="Type a message ..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className="outline-none" onClick={handleSendMessage}>
            <span className="cssChatSendButton material-symbols-rounded mr-3 flex px-3 py-[9px] items-center bg-chatSectionInputField rounded-md">
              send
            </span>
          </button>
        </section>
      </div>
    </>
  );
};

export default ChatSectionWithFriends;
