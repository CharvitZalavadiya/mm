import "@/context/UserContext";
import { useUserContext } from "@/context/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";

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

  return (
    <div className="py-1 px-3 h-[85vh]">
      {messageHistory.map((msg, index) => (
        <li key={index} className="border border-chatSectionMessageBorder rounded-md px-3 py-1 bg-chatSectionMessageBG">
          {msg.content}
        </li>
      ))}
      {/* <p className="text-zinc-500 text-xl w-full h-full flex justify-center items-center">
        Share your thoughts with {selectedUser?.username}
      </p> */}
    </div>
  );
};

export default ChatSectionWithFriends;

// import { useEffect, useState } from 'react';
// import { useUserContext } from '@/context/UserContext';

// const ChatSectionWithFriends = () => {
//   const { selectedUser, currentUser } = useUserContext();
//   const [messages, setMessages] = useState<{ from: string; content: string }[]>([]);
//   const [message, setMessage] = useState('');
//   const [ws, setWs] = useState<WebSocket | null>(null);

//   useEffect(() => {
//     if (!selectedUser?.userId || !currentUser?.userId) return;

//     const socket = new WebSocket(`ws://localhost:8080/friends/chat?userId=${currentUser.userId}`);
//     setWs(socket);

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setMessages((prevMessages) => [...prevMessages, data]);
//     };

//     return () => {
//       socket.close();
//     };
//   }, [selectedUser, currentUser]);

//   const sendMessage = () => {
//     if (ws && message.trim()) {
//       ws.send(JSON.stringify({ to: selectedUser.userId, content: message }));
//       setMessages((prevMessages) => [...prevMessages, { from: currentUser.userId, content: message }]);
//       setMessage('');
//     }
//   };

//   return (
//     <div className="py-1 px-3 h-[85vh] flex flex-col">
//       <div className="flex-grow overflow-y-auto">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 my-2 max-w-[70%] ${msg.from === currentUser.userId ? 'self-end bg-blue-200' : 'self-start bg-gray-200'}`}
//           >
//             {msg.content}
//           </div>
//         ))}
//       </div>
//       <div className="flex items-center mt-2">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="flex-grow border rounded p-2"
//           placeholder={`Message ${selectedUser?.userId}`}
//         />
//         <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatSectionWithFriends;
