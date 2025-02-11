"use client";

import SideBar from "@/layout/sidebar/page";
import TopBarFlowcharts from "@/layout/topbarFlowcharts/page";
import { Suspense, useEffect, useState } from "react";
import "./responsive.css";
import Flowcharts from "@/layout/flowcharts/page";
import { v4 as uuidv4 } from "uuid";
import { encryptData, decryptData } from "@/utils/cryptojs";
import axios from "axios";

interface Flowchart {
  userId: string;
  flowcharts: object;
  uniqueId: string;
  title: string;
  color: string;
  data: object;
}

const baseUrl = "https://mind-maps-backend.onrender.com";
const localUrl = "http://localhost:8080";

export default function FlowChart() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("allColor");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const fetchFlowcharts = async () => {
    try {
      if (!userId) return;
      const response = await fetch(`${baseUrl}/flowcharts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Userid": userId,
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json(); // ✅ Convert ReadableStream to JSON
      console.log("Fetched flowcharts:", data);
      
    } catch (error) {
      console.log("error fetching flowcharts : ", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFlowcharts();
    }
  }, [userId]);

  const colorArray = [
    "pink",
    "green",
    "yellow",
    "purple",
    "red",
    "cyan",
    "gray",
  ];

  const returnBg = (pickColor: string) => {
    switch (pickColor) {
      case "pink":
        return "bg-pink-500/20 border-pink-500 hover:bg-pink-500/30";
      case "green":
        return "bg-green-500/20 border-green-500 hover:bg-green-500/30";
      case "yellow":
        return "bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30 ";
      case "purple":
        return "bg-purple-500/20 border-purple-500 hover:bg-purple-500/30";
      case "red":
        return "bg-red-500/20 border-red-500 hover:bg-red-500/30";
      case "cyan":
        return "bg-cyan-500/20 border-cyan-500 hover:bg-cyan-500/30";
      case "gray":
        return "bg-gray-500/20 border-gray-500 hover:bg-gray-500/30";
      default:
        return "";
    }
  };

  const returnBgforPopup = (pickColor: string) => {
    switch (pickColor) {
      case "pink":
        return "bg-pink-500/40 border-pink-500 hover:bg-pink-500/60";
      case "green":
        return "bg-green-500/40 border-green-500 hover:bg-green-500/60";
      case "yellow":
        return "bg-yellow-500/40 border-yellow-500 hover:bg-yellow-500/60 ";
      case "purple":
        return "bg-purple-500/40 border-purple-500 hover:bg-purple-500/60";
      case "red":
        return "bg-red-500/40 border-red-500 hover:bg-red-500/60";
      case "cyan":
        return "bg-cyan-500/40 border-cyan-500 hover:bg-cyan-500/60";
      case "gray":
        return "bg-gray-500/40 border-gray-500 hover:bg-gray-500/60";
      default:
        return "";
    }
  };

  const handleCreateNewFlowchart = async () => {
    console.log("new flowchart initialized");

    const newFlowchart = {
      userId: userId,
      flowcharts: [
        {
          uniqueId: uuidv4(),
          title: encryptData("Flowchart"), // Encrypt the title
          color:
            selectedColor === "allColor"
              ? encryptData("gray")
              : encryptData(selectedColor), // Default color or user-selected
          data: {
            nodes: [
              {
                id: "1",
                position: { x: 250, y: 5 },
                data: {
                  label: encryptData("Start Node"), // Encrypt label
                  shape: encryptData("rectangle"), // Encrypt shape
                  color: encryptData("#22c55e"), // Encrypt color
                },
                type: "custom",
                width: 150,
                height: 60,
              },
              {
                id: "2",
                position: { x: 400, y: 150 },
                data: {
                  label: encryptData("End Node"), // Encrypt label
                  shape: encryptData("circle"), // Encrypt shape
                  color: encryptData("#22c55e"), // Encrypt color
                },
                type: "custom",
                width: 100,
                height: 100,
              },
            ],
            edges: [
              {
                source: "1",
                target: "2",
                markerEnd: { type: "arrowclosed" },
                id: "edge-1-2",
              },
            ],
          },
        },
      ],
    };

    try {
      await axios.post<Flowchart>(`${baseUrl}/flowcharts/`, newFlowchart);
    } catch (error) {
      console.error("Error creating new note:", error);
    } finally {
      const responsenew = await fetch(`${baseUrl}/flowcharts`, {
        cache: "no-store",
      });

      if (!responsenew.ok) throw new Error("Failed to fetch flowcharts");
      // throw new Error("Failed to create new flowchart");
    }
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
      <div className="cssMainCompFlowcharts bg-sidebarGradient rounded-lg tracking-wide leading-relaxed h-[95dvh] overflow-y-scroll p-5 ml-3 w-full">
        <span className="top-0 sticky">
          <TopBarFlowcharts
            onSearch={handleSearch}
            onCreateFlowchart={handleCreateNewFlowchart}
            onColorChange={handleColorChange}
            selectedColor={selectedColor}
            onToggleSidebar={handleToggleSidebar}
          />
        </span>
        <section>
          <Flowcharts onCreateFlowchart={handleCreateNewFlowchart} />
        </section>
      </div>
    </main>
  );
}
