// "use client";
// import { useEffect, useState } from "react";
// import SideBar from "../_sidebar/page";
// import UserDetails from "../_userDetails/page";
// import TopbarFriends from "../_topbarFriends/page";

// interface User {
//   id: string;
//   username: string;
// }

// const Friends = () => {
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [selectedColor, setSelectedColor] = useState<string>("black");
//   const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleToggleSidebar = () => {
//     setIsSidebarVisible(!isSidebarVisible);
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleCloseSidebar = () => {
//     if (isSidebarVisible) {
//       setIsSidebarVisible(false);
//     }
//   };

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//   };

//   const handleColorChange = (color: string) => {
//     setSelectedColor(color);
//   };

//   return (
//     <div className="flex p-3">
//       <span>
//         {isSidebarVisible && (
//           <SideBar isOpen={isSidebarOpen} onClose={handleToggleSidebar} />
//         )}
//       </span>

//       <main className="cssMainCompNotes bg-sidebarGradient rounded-lg tracking-wide leading-relaxed h-[95vh] overflow-y-scroll p-5 ml-3 w-full">
//         <span className="top-0 sticky">
//           <TopbarFriends
//             onSearch={handleSearch}
//             onColorChange={handleColorChange}
//             selectedColor={selectedColor} // Pass the current selected color to TopBar
//             onToggleSidebar={handleToggleSidebar}
//           />
//         </span>
//         <span>
//           <UserDetails />
//         </span>
//       </main>
//     </div>
//   );
// };

// export default Friends;






"use client";

import { useState } from "react";
import SideBar from "../_sidebar/page";
import UserDetails from "../_userDetails/page";
import TopbarFriends from "../_topbarFriends/page";
import "./responsive.css"

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex p-3">
      <span>
        {isSidebarVisible && (
          <SideBar isOpen={isSidebarOpen} onClose={handleToggleSidebar} />
        )}
      </span>

      <main className="cssMainCompFriends bg-sidebarGradient rounded-lg tracking-wide leading-relaxed h-[95vh] overflow-y-scroll p-5 ml-3 w-full">
        <span className="top-0 sticky">
          <TopbarFriends
            onSearch={handleSearch}
            onColorChange={handleColorChange}
            selectedColor={selectedColor}
            onToggleSidebar={handleToggleSidebar}
          />
        </span>
        <span>
          <UserDetails searchQuery={searchQuery} />
        </span>
      </main>
    </div>
  );
};

export default Friends;
