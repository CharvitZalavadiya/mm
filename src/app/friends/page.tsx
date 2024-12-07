"use client";

import { useState } from "react";
import SideBar from "@/layout/sidebar/page";
import UserDetails from "@/layout/userDetails/page";
import TopbarFriends from "@/layout/topbarFriends/page";
import "./responsive.css";

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("connectToMore");

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTabSelection = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex justify-end w-screen p-3">
      <span>
        {isSidebarVisible && (
          <SideBar isOpen={isSidebarOpen} onClose={handleToggleSidebar} />
        )}
      </span>

      <div className="bg-sidebarGradient ml-3 rounded-lg w-full">
        <main className="cssMainCompFriends overflow-y-scroll rounded-lg tracking-wide leading-relaxed h-[95vh] p-5 w-full">
          <section className="top-0 sticky backdrop-blur-[5px]">
            <TopbarFriends
              onSearch={handleSearch}
              onToggleSidebar={handleToggleSidebar}
            />
            <section className="cssHeadingAndDropdown rounded-lg right-9 flex items-center">
              {/* Conditional Heading based on selectedTab */}
              <span className="flex-1">
                {selectedTab === "connectToMore" && (
                  <h3 className="cssRequestSentHeading h-full text-2xl text-slate-100">
                    Connect with people
                  </h3>
                )}
                {selectedTab === "friends" && (
                  <h3 className="cssRequestSentHeading h-full text-2xl text-slate-100">
                    Friends
                  </h3>
                )}
                {selectedTab === "requests" && (
                  <h3 className="cssRequestSentHeading h-full text-2xl text-slate-100">
                    Requests Received
                  </h3>
                )}
              </span>
              <select
                className="cssButtonSize rounded px-4 py-1 bg-tagSelectorGradient text-slate-300 outline-none"
                value={selectedTab}
                onChange={(e) => handleTabSelection(e.target.value)}
              >
                <option value="friends" className="bg-selectedFunctionalityBackgroundColor">
                  Friends
                </option>
                <option value="requests" className="bg-selectedFunctionalityBackgroundColor">
                  Requests
                </option>
                <option value="connectToMore" className="bg-selectedFunctionalityBackgroundColor">
                  Connect
                </option>
              </select>
            </section>
          </section>

          <section>
            {/* Pass the selected tab to UserDetails */}
            <UserDetails searchQuery={searchQuery} selectedTab={selectedTab} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Friends;
