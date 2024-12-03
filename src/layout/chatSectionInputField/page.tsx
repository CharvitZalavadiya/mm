import React, { useState } from "react";
import EmojiPicker from "@/components/comps/EmojiPicker";

const ChatSectionInputField: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prevMessage) => prevMessage + emoji); // Append emoji to message
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
      />
      <button className="outline-none">
        <span className="material-symbols-rounded mr-2 flex px-3 py-[6px] items-center bg-chatSectionInputField rounded-md">
          send
        </span>
      </button>
    </div>
  );
};

export default ChatSectionInputField;
