"use client";

import React, { useState, useEffect } from "react";

interface TopbarFriendsProps {
  onSearch: (query: string) => void;
  onToggleSidebar: () => void;
}

const TopbarChat: React.FC<TopbarFriendsProps> = ({
  onSearch,
  onToggleSidebar,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);
  const [placeholderText, setPlaceholderText] =
    useState<string>("Search in Chat");

  useEffect(() => {
    const handleResize = () => {
      setIsMenuVisible(window.innerWidth < 850);
      setPlaceholderText(
        window.innerWidth > 420 ? "Search in Chat" : "Search"
      );
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = () => {
    onToggleSidebar();
  };

  return (
    <div className="inline-flex h-full items-center select-none justify-evenly backdrop-blur-lg">
      {isMenuVisible && (
        <span
          className="cssMenu mr-3 hidden material-symbols-outlined cursor-pointer"
          onClick={handleMenuClick}
        >
          menu
        </span>
      )}
    </div>
  );
};

export default TopbarChat;