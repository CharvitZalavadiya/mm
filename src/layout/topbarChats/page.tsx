"use client";

import React, { useState, useEffect } from "react";

interface TopbarChatsProps {
  onSearch: (query: string) => void;
  onToggleSidebar: () => void;
}

const TopbarChats: React.FC<TopbarChatsProps> = ({
  onSearch,
  onToggleSidebar,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);
  const [placeholderText, setPlaceholderText] =
    useState<string>("Search by Title");
  const [selectedColorBorderWidth, setSelectedColorBorderWidth] =
    useState<string>("-2");

  useEffect(() => {
    const handleResize = () => {
      setIsMenuVisible(window.innerWidth < 850);
      setPlaceholderText(
        window.innerWidth > 420 ? "Search by Title" : "Search"
      );
      setSelectedColorBorderWidth(window.innerWidth > 385 ? "-2" : "");
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    onSearch(event.target.value);
  };

  const handleMenuClick = () => {
    onToggleSidebar();
  };

  return (
    <div className="flex gap-3 mb-3 select-none justify-evenly backdrop-blur-lg">
      {isMenuVisible && (
        <span
          className="cssMenu hidden material-symbols-outlined py-2 cursor-pointer"
          onClick={handleMenuClick}
        >
          menu
        </span>
      )}
      <div className="cssTopbarFull flex gap-3 w-full">
        <div className="cssTopbarSearchAndNew flex gap-3 w-full">
          <span className="w-full bg-navBlockBackground rounded-full py-1 px-1 flex">
            <span className="cssTopbarSearchIcon material-symbols-outlined rounded-full p-1 px-2 select-none hover:cursor-pointer">
              search
            </span>
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              className="cssTopbarSearch w-full px-2 bg-transparent focus:outline-none"
              placeholder={placeholderText}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopbarChats;
