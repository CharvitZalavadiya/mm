"use client"
import { useUserContext } from "../../context/UserContext";

const Chat = () => {
  const { selectedUser } = useUserContext();

  return (
    <div>
      {selectedUser ? (
        <h2>Chat with {selectedUser.username}</h2>
      ) : (
        <p>No user selected</p>
      )}
    </div>
  );
};

export default Chat;
