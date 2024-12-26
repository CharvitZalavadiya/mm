"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import SideBar from "@/layout/sidebar/page";
import "./responsive.css";
import { useRouter } from "next/navigation";
import TopbarChat from "@/layout/topbarChat/page";
import ChatDetailsOfFriends from "@/layout/chatDetailsOfFriends/page";
import ChatSectionWithFriends from "@/layout/chatSectionWithFriends/page";
import ChatSectionInputField from "@/layout/chatSectionInputField/page";

const Chat = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { selectedUser } = useUserContext();

  const router = useRouter();

  useEffect(() => {
    if (!selectedUser) {
      router.push("/friends");
    }
  }, [selectedUser, router]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex justify-end w-screen p-3">
      <span>
        {isSidebarVisible && (
          <SideBar isOpen={isSidebarOpen} onClose={handleToggleSidebar} />
        )}
      </span>

      <div className="bg-sidebarGradient ml-3 rounded-lg w-full">
        <main className="cssMainCompFriends overflow-y-scroll rounded-lg tracking-wide leading-relaxed h-[95vh] w-full">
          <section className="inline-flex top-0 sticky bg-chatFriendDetailsGradient w-full py-1 px-3 rounded-lg h-12">
            <span>
              <TopbarChat
                onSearch={handleSearch}
                onToggleSidebar={handleToggleSidebar}
              />
            </span>
            <ChatDetailsOfFriends />
          </section>
          <ChatSectionWithFriends />
          {/* <section className="sticky bottom-0">
            <ChatSectionInputField />
          </section> */}
        </main>
      </div>
    </div>
  );
};

export default Chat;
