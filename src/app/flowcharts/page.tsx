"use client";

import SideBar from "@/layout/sidebar/page";
import TopBarFlowcharts from "@/layout/topbarFlowcharts/page";
import { Suspense, useEffect, useState } from "react";
import "./responsive.css";
import Flowcharts from "@/layout/flowcharts/page";
import { v4 as uuidv4 } from "uuid";
import { encryptData } from "@/utils/cryptojs";
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
const localUrl = "http://localhost:56765";

export default function FlowChart() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("allColor");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [refetchChildComponent, setRefetchChildComponent] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleCreateNewFlowchart = async () => {
    const newFlowchart = {
      userId: userId,
      flowcharts: [
        {
          uniqueId: uuidv4(),
          title: encryptData("Flowchart"),
          color:
            selectedColor === "allColor"
              ? encryptData("gray")
              : encryptData(selectedColor),
          data: {
            nodes: [
              {
                id: "1",
                position: { x: 250, y: 5 },
                data: {
                  label: encryptData("Start Node"),
                  shape: encryptData("rectangle"),
                  color: encryptData("#22c55e"),
                },
                type: "custom",
                width: 100,
                height: 50,
              },
              {
                id: "2",
                position: { x: 350, y: 100 },
                data: {
                  label: encryptData("End Node"),
                  shape: encryptData("circle"),
                  color: encryptData("#22c55e"),
                },
                type: "custom",
                width: 70,
                height: 70,
              },
            ],
            edges: [
              // {
              //   source: "1",
              //   target: "2",
              //   markerEnd: { type: "ArrowClosed" },
              //   id: "edge-1-2",
              // },
            ],
          },
        },
      ],
    };

    try {
      await axios.post<Flowchart>(`${baseUrl}/flowcharts/`, newFlowchart);
      setRefetchChildComponent((prev) => !prev);
    } catch (error) {
      console.error("Error creating new flowchart:", error);
    } finally {
      // const responsenew = await fetch(`${baseUrl}/flowcharts`, {
      //   cache: "no-store",
      // });

      // if (!responsenew.ok) throw new Error("Failed to fetch flowcharts after creating flowchart");
      console.log("finally create new flowchart");
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
          <Flowcharts
            onCreateFlowchart={handleCreateNewFlowchart}
            userId={userId ?? ""}
            refetchChildComponent={refetchChildComponent}
            selectedColor={selectedColor}
          />
        </section>
      </div>
    </main>
  );
}
