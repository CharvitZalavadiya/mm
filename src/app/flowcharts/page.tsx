"use client";

import SideBar from "@/layout/sidebar/page";
import TopBarFlowcharts from "@/layout/topbarFlowcharts/page";
import { Suspense, useState } from "react";
import "./responsive.css"

export default function FlowChart() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("allColor");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCreateNewFlowchart = async () => {
    console.log("clicked on pluse ");
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleCloseSidebar = () => {
    if (isSidebarVisible) {
      setIsSidebarVisible(false);
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <main className="flex justify-end w-screen p-3">
      <div>
        <Suspense fallback="sidebar">
          {/* {isSidebarVisible && sidebarComp} */}
          {isSidebarVisible && (
            <SideBar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
          )}
        </Suspense>
      </div>
      <div className="cssMainCompNotes bg-sidebarGradient rounded-lg tracking-wide leading-relaxed h-[95dvh] overflow-y-scroll p-5 ml-3 w-full">
        <span className="top-0 sticky">
          <TopBarFlowcharts
            onSearch={handleSearch}
            onCreateFlowchart={handleCreateNewFlowchart}
            onColorChange={handleColorChange}
            selectedColor={selectedColor}
            onToggleSidebar={handleToggleSidebar}
          />
        </span>
      </div>
    </main>
  );
}
