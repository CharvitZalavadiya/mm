"use client";

import { useState } from "react";
import SideBar from "@/layout/sidebar/page";
import "./responsive.css";
import TopbarChats from "@/layout/topbarChats/page";
import ConnectedFriends from "@/layout/connectedFriends/page";

const Chats = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex justify-end w-screen p-3">
      <span>
        {isSidebarVisible && (
          <SideBar isOpen={isSidebarOpen} onClose={handleToggleSidebar} />
        )}
      </span>

      <div className="bg-sidebarGradient ml-3 rounded-lg w-full">
        <main className="cssMainCompFriends overflow-y-scroll rounded-lg tracking-wide leading-relaxed h-[95dvh] p-5 w-full">
          <section className="top-0 sticky backdrop-blur-[5px]">
            <TopbarChats
              onSearch={handleSearch}
              onToggleSidebar={handleToggleSidebar}
            />
          </section>
          <section className="cssRequestSentHeading h-full text-2xl text-slate-100">
            Chats with Friends
            <ConnectedFriends searchQuery={searchQuery} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Chats;
