// import React, { useState, useEffect } from "react";

// interface TopbarFriends {
//   onSearch: (query: string) => void;
//   onColorChange: (color: string) => void;
//   selectedColor: string;
//   onToggleSidebar: () => void; // Prop to handle sidebar toggle
// }

// const TopbarFriends: React.FC<TopbarFriends> = ({
//   onSearch,
// //   onCreateNote,
//   onColorChange,
//   selectedColor,
//   onToggleSidebar, // Destructure the new prop
// }) => {
//   const [searchText, setSearchText] = useState("");
//   const [isMenuVisible, setIsMenuVisible] = useState(true); // Manage visibility of the menu icon
//   const [placeholderText, setPlaceholderText] = useState("Search by Title"); // Manage the placeholder text
//   const [selectedColorBorderWidth, setSelectedColorBorderWidth] =
//     useState("-2");

//   // width based css changes
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMenuVisible(window.innerWidth < 850);
//       setPlaceholderText(
//         window.innerWidth > 650 ? "Search by Title" : "Search"
//       );
//       setSelectedColorBorderWidth(window.innerWidth > 385 ? "-2" : "");
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize(); // Check on initial load

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const colorArray = [
//     "black",
//     "pink",
//     "green",
//     "yellow",
//     "purple",
//     "red",
//     "cyan",
//     "gray",
//   ];

//   const returnBg = (pickColor: string) => {

//     const baseClass = `${pickColor === selectedColor ? `border${selectedColorBorderWidth}` : ""}`;
//     switch (pickColor) {
//       case "black":
//         return `${baseClass} bg-black/50 hover:bg-black/70`;
//       case "pink":
//         return `${baseClass} bg-pink-500/50 hover:bg-pink-500/70`;
//       case "green":
//         return `${baseClass} bg-green-500/50 hover:bg-green-500/70`;
//       case "yellow":
//         return `${baseClass} bg-yellow-500/50 hover:bg-yellow-500/70`;
//       case "purple":
//         return `${baseClass} bg-purple-500/50 hover:bg-purple-500/70`;
//       case "red":
//         return `${baseClass} bg-red-500/50 hover:bg-red-500/70`;
//       case "cyan":
//         return `${baseClass} bg-cyan-500/50 hover:bg-cyan-500/70`;
//       case "gray":
//         return `${baseClass} bg-gray-500/50 hover:bg-gray-500/70`;
//       default:
//         return "";
//     }
//   };

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchText(event.target.value);
//     onSearch(event.target.value);
//   };

//   const handleColorClick = (color: string) => {
//     onColorChange(color); // Notify parent of color change
//   };

//   const handleMenuClick = () => {
//     onToggleSidebar(); // Call the parent function to toggle sidebar
//   };

//   return (
//     <div className="flex gap-3 mb-3 select-none justify-evenly backdrop-blur-lg">
//       {isMenuVisible && (
//         <span
//           className="cssMenu material-symbols-outlined py-2 cursor-pointer"
//           onClick={handleMenuClick}
//         >
//           menu
//         </span>
//       )}
//       <div className="cssTopbarFull flex gap-3 w-full">
//         <div className="cssTopbarSearchAndNew flex gap-3 w-2/3">
//           <span className="w-full bg-navBlockBackground rounded-full py-1 px-1 flex">
//             <span className="cssTopbarSearchIcon material-symbols-outlined rounded-full p-1 px-2 select-none hover:cursor-pointer">
//               search
//             </span>
//             <input
//               type="text"
//               value={searchText}
//               onChange={handleSearchChange}
//               className="cssTopbarSearch w-full px-2 bg-transparent focus:outline-none"
//               placeholder={placeholderText} // Set placeholder based on screen width
//             />
//           </span>
//           <button
//             // onClick={onCreateNote}
//             className="cssTopbarNew bg-navBlockBackground rounded-full py-2 px-3 flex place-content-center"
//           >
//             <span className="cssTopbarNewIcon material-symbols-outlined rounded-full select-none hover:cursor-pointer">
//               add
//             </span>
//           </button>
//         </div>
//         <span className="cssTopbarColors bg-navBlockBackground rounded-full py-1 px-3 max-w-1/3 overflow-x-auto flex gap-2">
//           {colorArray.map((color) => (
//             <ul className="py-1" key={color}>
//               <li
//                 className={`${returnBg(
//                   color
//                 )} cssTopbarColor w-6 h-6 rounded-full hover:cursor-pointer`}
//                 onClick={() => handleColorClick(color)}
//               ></li>
//             </ul>
//           ))}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default TopbarFriends;

// "use client";

// import { useState } from "react";

// interface TopbarFriendsProps {
//   onSearch: (query: string) => void;
//   onColorChange: (color: string) => void;
//   selectedColor: string;
//   onToggleSidebar: () => void;
// }

// const TopbarFriends: React.FC<TopbarFriendsProps> = ({
//   onSearch,
//   onColorChange,
//   selectedColor,
//   onToggleSidebar,
// }) => {
//   const [searchInput, setSearchInput] = useState<string>("");

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchInput(e.target.value);
//     onSearch(e.target.value);
//   };

//   return (
//     <div className="topbar">
//       <button onClick={onToggleSidebar}>Toggle Sidebar</button>
//       <input
//         type="text"
//         value={searchInput}
//         onChange={handleSearchChange}
//         placeholder="Search by Username"
//       />
//       {/* Add color picker and other components as needed */}
//     </div>
//   );
// };

// export default TopbarFriends;

"use client";

import React, { useState, useEffect } from "react";

interface TopbarFriendsProps {
  onSearch: (query: string) => void;
  onColorChange: (color: string) => void;
  selectedColor: string;
  onToggleSidebar: () => void;
}

const TopbarFriends: React.FC<TopbarFriendsProps> = ({
  onSearch,
  onColorChange,
  selectedColor,
  onToggleSidebar,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);
  const [placeholderText, setPlaceholderText] =
    useState<string>("Search by Title");
  const [selectedColorBorderWidth, setSelectedColorBorderWidth] =
    useState<string>("-2");

  // Handle dynamic layout changes based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsMenuVisible(window.innerWidth < 850);
      setPlaceholderText(
        window.innerWidth > 650 ? "Search by Title" : "Search"
      );
      setSelectedColorBorderWidth(window.innerWidth > 385 ? "-2" : "");
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const colorArray = [
    "black",
    "pink",
    "green",
    "yellow",
    "purple",
    "red",
    "cyan",
    "gray",
  ];

  const returnBg = (pickColor: string) => {
    const baseClass = `${
      pickColor === selectedColor ? `border${selectedColorBorderWidth}` : ""
    }`;
    switch (pickColor) {
      case "black":
        return `${baseClass} bg-black/50 hover:bg-black/70`;
      case "pink":
        return `${baseClass} bg-pink-500/50 hover:bg-pink-500/70`;
      case "green":
        return `${baseClass} bg-green-500/50 hover:bg-green-500/70`;
      case "yellow":
        return `${baseClass} bg-yellow-500/50 hover:bg-yellow-500/70`;
      case "purple":
        return `${baseClass} bg-purple-500/50 hover:bg-purple-500/70`;
      case "red":
        return `${baseClass} bg-red-500/50 hover:bg-red-500/70`;
      case "cyan":
        return `${baseClass} bg-cyan-500/50 hover:bg-cyan-500/70`;
      case "gray":
        return `${baseClass} bg-gray-500/50 hover:bg-gray-500/70`;
      default:
        return "";
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    onSearch(event.target.value);
  };

  const handleColorClick = (color: string) => {
    onColorChange(color);
  };

  const handleMenuClick = () => {
    onToggleSidebar();
  };

  return (
    <div className="flex gap-3 mb-3 select-none justify-evenly backdrop-blur-lg">
      {isMenuVisible && (
        <span
          className="cssMenu material-symbols-outlined py-2 cursor-pointer"
          onClick={handleMenuClick}
        >
          menu
        </span>
      )}
      <div className="cssTopbarFull flex gap-3 w-full">
        <div className="cssTopbarSearchAndNew flex gap-3 w-2/3">
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
          <button className="cssTopbarNew bg-navBlockBackground rounded-full py-2 px-3 flex place-content-center">
            <span className="cssTopbarNewIcon material-symbols-outlined rounded-full select-none hover:cursor-pointer">
              add
            </span>
          </button>
        </div>
        <span className="cssTopbarColors bg-navBlockBackground rounded-full py-1 px-3 max-w-1/3 overflow-x-auto flex gap-2">
          {colorArray.map((color) => (
            <ul className="py-1" key={color}>
              <li
                className={`${returnBg(
                  color
                )} cssTopbarColor w-6 h-6 rounded-full hover:cursor-pointer`}
                onClick={() => handleColorClick(color)}
              ></li>
            </ul>
          ))}
        </span>
      </div>
    </div>
  );
};

export default TopbarFriends;