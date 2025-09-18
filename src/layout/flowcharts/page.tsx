import { useEffect, useState } from "react";
import FlowchartsSkeleton from "./flowchartsSkeleton";
import FlowchartDetails from "../flowchartDetails/page"; // ✅ Import child component
import "./responsive.css";
import { decryptData, encryptData } from "@/utils/cryptojs";
import { MoreVerticalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface FlowchartItem {
  uniqueId: string;
  title: string;
  color: string;
  data: {
    nodes: {
      id: string;
      position: { x: number; y: number };
      data: {
        label: string;
        shape: string;
        color: string;
      };
      type: string;
      width: number;
      height: number;
    }[];
    edges: {
      source: string;
      target: string;
      markerEnd: { type: string };
      id: string;
    }[];
  };
}

interface FlowchartsResponse {
  _id: string;
  userId: string;
  flowcharts: FlowchartItem[];
}

interface FlowchartsProps {
  onCreateFlowchart: () => void;
  userId: string;
  refetchChildComponent: boolean;
  selectedColor: string;
  searchQuery: string;
}

const baseUrl = "https://mind-maps-backend.onrender.com";
const localUrl = "http://localhost:56765";

const Flowcharts: React.FC<FlowchartsProps> = ({
  onCreateFlowchart,
  userId,
  refetchChildComponent,
  selectedColor,
  searchQuery,
}) => {
  const [flowchartsArray, setFlowchartsArray] = useState<FlowchartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFlowchart, setSelectedFlowchart] =
    useState<FlowchartItem | null>(null);
  // const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editColor, setEditColor] = useState<string>("");

  const filteredFlowcharts = flowchartsArray.filter((flowchart) =>
    (selectedColor === "allColor" || flowchart.color === selectedColor) &&
    flowchart.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

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
        return "bg-pink-500/30 border-pink-500 hover:bg-pink-500/40";
      case "green":
        return "bg-green-500/30 border-green-500 hover:bg-green-500/40";
      case "yellow":
        return "bg-yellow-500/30 border-yellow-500 hover:bg-yellow-500/40 ";
      case "purple":
        return "bg-purple-500/30 border-purple-500 hover:bg-purple-500/40";
      case "red":
        return "bg-red-500/30 border-red-500 hover:bg-red-500/40";
      case "cyan":
        return "bg-cyan-500/30 border-cyan-500 hover:bg-cyan-500/40";
      case "gray":
        return "bg-gray-500/30 border-gray-500 hover:bg-gray-500/40";
      default:
        return "";
    }
  };

  // Decrypt flowchart data
  const decryptFlowchartData = (flowchart: any): FlowchartItem => ({
    uniqueId: flowchart.uniqueId,
    title: decryptData(flowchart.title),
    color: decryptData(flowchart.color),
    data: {
      nodes: flowchart.data.nodes.map((node: any) => ({
        ...node,
        data: {
          label: decryptData(node.data.label),
          shape: decryptData(node.data.shape),
          color: decryptData(node.data.color),
        },
      })),
      edges: flowchart.data.edges,
    },
  });

  // Fetch flowcharts
  const fetchFlowcharts = async () => {
    try {
      if (!userId) return;
      const response = await fetch(`${baseUrl}/flowcharts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Userid": userId,
        },
      });

      if (response.ok) {
        const data: FlowchartsResponse = await response.json();
        const decryptedFlowcharts = data.flowcharts.map(decryptFlowchartData);
        setFlowchartsArray(decryptedFlowcharts);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching flowcharts in child component:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFlowcharts();
    }
  }, [userId, onCreateFlowchart, refetchChildComponent]);

  // ✅ Set the selected flowchart on click
  const openFlowchartDetails = (flowchart: FlowchartItem) => {
    setSelectedFlowchart(flowchart);
    const topbar = document.getElementById("flowchartTopbar");
    topbar?.classList.add("hidden");
  };

  // ✅ Close flowchart details and show the list again
  const closeFlowchartDetails = () => {
    setSelectedFlowchart(null);
    const topbar = document.getElementById("flowchartTopbar");
    topbar?.classList.remove("hidden");
  };

  const handleMoreClick = (flowchart: FlowchartItem, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click event

    setSelectedFlowchart(flowchart); // ✅ Store the selected flowchart
    setEditTitle(flowchart.title); // ✅ Set the current title
    setEditColor(flowchart.color); // ✅ Set the current color
    setIsDialogOpen(true);

    const topbar = document.getElementById("flowchartTopbar");
    topbar?.classList.add("hidden");
  };

  const handleSaveFlowchart = async () => {
    if (!selectedFlowchart) return;

    try {
      const encryptedTitle = encryptData(editTitle);
      const encryptedColor = encryptData(editColor);
      const userId = localStorage.getItem("userId");


      await axios.patch(`${baseUrl}/flowcharts/update/${selectedFlowchart.uniqueId}`, {
        flowchartTitle: encryptedTitle,
        flowchartColor: encryptedColor,
        userId,
        flowchartId: selectedFlowchart.uniqueId
      }, {
        headers: { "Content-Type": "application/json" },
      });
      
      setFlowchartsArray((prev) =>
        prev.map((flowchart) =>
          flowchart.uniqueId === selectedFlowchart.uniqueId
            ? { ...flowchart, title: editTitle, color: editColor }
            : flowchart
        )
      );

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating flowchart:", error);
      setIsDialogOpen(false);
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleDeleteFlowchart = async () => {
    if (!selectedFlowchart) return;
  
    try {
      const userId = localStorage.getItem("userId");
  
      await axios.delete(`${baseUrl}/flowcharts/${selectedFlowchart.uniqueId}`, {
        data: { userId, flowchartId: selectedFlowchart.uniqueId},
        headers: { "Content-Type": "application/json" },
      });
  
      setFlowchartsArray((prev) =>
        prev.filter((flowchart) => flowchart.uniqueId !== selectedFlowchart.uniqueId)
      );
  
      setSelectedFlowchart(null); // Reset selection after deletion
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error deleting flowchart:", error);
      setIsDialogOpen(false);
    } finally {
      setSelectedFlowchart(null); // Reset selection after deletion
      setIsDialogOpen(false);

      const topbar = document.getElementById("flowchartTopbar");
    topbar?.classList.remove("hidden");
    }
  };
  

  return (
    <div>
      {selectedFlowchart ? ( // ✅ Show FlowchartDetails if one is selected
        <FlowchartDetails
          flowchart={selectedFlowchart}
          onClose={closeFlowchartDetails}
          fetchFlowcharts={fetchFlowcharts}
        />
      ) : (
        <ul className="cssFlowchartsGrid grid grid-cols-4 gap-4 max-h-full overflow-y-scroll">
          {loading ? (
            <FlowchartsSkeleton />
          ) : filteredFlowcharts.length > 0 ? (
            filteredFlowcharts.map((flowchart) => (
              <li
                key={flowchart.uniqueId}
                onClick={() => openFlowchartDetails(flowchart)} // ✅ Show details on click
                className={`${returnBg(
                  flowchart.color
                )} border w-46 h-32 flex flex-col items-end rounded-lg p-4 select-none cursor-pointer hover:bg-opacity-50`}
              >
                <button
                  onClick={(e) => handleMoreClick(flowchart, e)}
                  className="hover:bg-zinc-500 w-fit rounded-full p-1 mb-5"
                >
                  <MoreVerticalIcon />
                </button>
                <h4 className="text-slate-200 font-semibold text-lgFont relative w-full h-10 truncate">
                  {flowchart.title}
                </h4>
              </li>
            ))
          ) : (
            <p className="text-mdFont text-slate-400 w-full">
              Start making flowcharts by clicking + icon
            </p>
          )}
        </ul>
      )}

      {isDialogOpen && selectedFlowchart && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md">
          <div className="cssFlowchartDialogBox bg-noteBackground p-6 rounded-lg shadow-lg w-fit">
            <h2 className="text-lg font-bold mb-3 select-none">
              Edit Flowchart
            </h2>

            <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
              <Label htmlFor="name" className="select-none">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                placeholder={editTitle}
                className="bg-noteBackground focus:outline-none"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>

            {/* ✅ Color Picker - Shows current color */}
            <label className="block mb-2 text-sm font-medium select-none">
              Color
            </label>
            <span className="cssTopbarColors bg-navBlockBackground rounded-full w-fit py-1 px-3 overflow-x-auto flex gap-2 mb-6">
              {colorArray.map((color) => (
                <ul className="py-1" key={color}>
                  <li
                    className={`${returnBg(color)} ${
                      editColor === color ? "border-2" : ""
                    } cssTopbarColor w-6 h-6 rounded-full hover:cursor-pointer`}
                    onClick={() => setEditColor(color)}
                  ></li>
                </ul>
              ))}
            </span>

            <div className="cssFlowchartDialogButtons flex justify-between gap-2">
              <button
                onClick={handleDeleteFlowchart}
                className="px-4 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={handleSaveFlowchart}
                className="px-4 py-1 bg-blue-500 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-1 bg-white text-black rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flowcharts;
