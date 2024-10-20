"use client";

import { useState } from "react";
import SideBar from "../_sidebar/page";
import UserDetails from "../_userDetails/page";
import TopbarFriends from "../_topbarFriends/page";
import "./responsive.css";

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("connectToMore");

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    if (isSidebarVisible) {
      setIsSidebarVisible(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="flex justify-end w-screen p-3">
      <span>
        {isSidebarVisible && (
          <SideBar isOpen={isSidebarOpen} onClose={handleToggleSidebar} />
        )}
      </span>

      <div className="bg-sidebarGradient ml-3 rounded-lg w-full">
        <main className="cssMainCompFriends overflow-y-scroll rounded-lg tracking-wide leading-relaxed h-[87vh] p-5 w-full">
          <section className="top-0 sticky">
            <TopbarFriends
              onSearch={handleSearch}
              onColorChange={handleColorChange}
              selectedColor={selectedColor}
              onToggleSidebar={handleToggleSidebar}
            />
          </section>
          <section>
            <UserDetails searchQuery={searchQuery} selectedTab={selectedTab} />
          </section>
        </main>

        <section className="p-2 rounded-lg">
          <span className="cssButtonSize flex justify-around gap-3">
            <button
              className={`w-1/3 rounded ${
                selectedTab === "friends" ? "text-cyan-400 font-smWeight bg-tagSelectorGradient" : "text-slate-500"
              }`}
              onClick={() => setSelectedTab("friends")}
            >
              Friends
            </button>
            <button
              className={`w-1/3 rounded ${
                selectedTab === "requests" ? "text-cyan-400 font-smWeight bg-tagSelectorGradient" : "text-slate-500"
              }`}
              onClick={() => setSelectedTab("requests")}
            >
              Requests
            </button>
            <button
              className={`w-1/3 rounded ${
                selectedTab === "connectToMore" ? "text-cyan-500 font-smWeight bg-tagSelectorGradient" : "text-slate-500"
              }`}
              onClick={() => setSelectedTab("connectToMore")}
            >
              Connect
            </button>
          </span>
        </section>
      </div>
    </div>
  );
};

export default Friends;
