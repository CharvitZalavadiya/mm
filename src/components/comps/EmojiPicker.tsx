import React, { useState } from "react";
import Picker, { EmojiClickData } from "emoji-picker-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    onEmojiSelect(emojiObject.emoji);
    setShowPicker(false);
  };

  return (
    
    <div className="cssEmojiPicker relative">
      <button
        className="bg-chatSectionInputField rounded-md py-2 px-3 ml-2 focus:outline-none"
        onClick={() => setShowPicker((prev) => !prev)}
      >
        &#128512;
      </button>

      {showPicker && (
        <div className="absolute bottom-full left-2 mb-2 z-5">
          {showPicker && (
            <Picker
              onEmojiClick={handleEmojiClick}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
