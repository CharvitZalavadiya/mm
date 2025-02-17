// import { useEffect, useState } from "react";
// import FlowchartsSkeleton from "./flowchartsSkeleton";
// import "./responsive.css";
// import { decryptData } from "@/utils/cryptojs";

// interface Flowchart {
//   uniqueId: string;
//   title: string;
//   color: string;
//   data: object;
// }

// interface FlowchartItem {
//   uniqueId: string;
//   title: string;
//   color: string;
//   data: {
//     nodes: {
//       id: string;
//       position: { x: number; y: number };
//       data: {
//         label: string;
//         shape: string;
//         color: string;
//       };
//       type: string;
//       width: number;
//       height: number;
//     }[];
//     edges: {
//       source: string;
//       target: string;
//       markerEnd: { type: string };
//       id: string;
//     }[];
//   };
// }

// interface FlowchartsResponse {
//   _id: string;
//   userId: string;
//   flowcharts: FlowchartItem[];
// }

// interface FlowchartsProps {
//   onCreateFlowchart: () => void;
//   userId: string;
//   refetchChildComponent: boolean;
// }

// const baseUrl = "https://mind-maps-backend.onrender.com";

// const Flowcharts: React.FC<FlowchartsProps> = ({
//   onCreateFlowchart,
//   userId,
//   refetchChildComponent,
// }) => {
//   // State to store fetched flowcharts (as JSON string)
//   const [fetchedFlowcharts, setFetchedFlowcharts] = useState<string>("");
//   const [flowchartsArray, setFlowchartsArray] = useState<FlowchartItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedFlowchart, setSelectedFlowchart] = useState<FlowchartItem | null>(null);

//   const returnBg = (pickColor: string) => {
//     switch (pickColor) {
//       case "pink":
//         return "bg-pink-500/20 border-pink-500 hover:bg-pink-500/30";
//       case "green":
//         return "bg-green-500/20 border-green-500 hover:bg-green-500/30";
//       case "yellow":
//         return "bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30 ";
//       case "purple":
//         return "bg-purple-500/20 border-purple-500 hover:bg-purple-500/30";
//       case "red":
//         return "bg-red-500/20 border-red-500 hover:bg-red-500/30";
//       case "cyan":
//         return "bg-cyan-500/20 border-cyan-500 hover:bg-cyan-500/30";
//       case "gray":
//         return "bg-gray-500/20 border-gray-500 hover:bg-gray-500/30";
//       default:
//         return "";
//     }
//   };


//   // decrypt the data
//   const decryptFlowchartData = (flowchart: any): FlowchartItem => ({
//     uniqueId: flowchart.uniqueId,
//     title: decryptData(flowchart.title),
//     color: decryptData(flowchart.color),
//     data: {
//       nodes: flowchart.data.nodes.map((node: any) => ({
//         ...node,
//         data: {
//           label: decryptData(node.data.label),
//           shape: decryptData(node.data.shape),
//           color: decryptData(node.data.color),
//         },
//       })),
//       edges: flowchart.data.edges,
//     },
//   });

//   // Function to fetch flowcharts
//   const fetchFlowcharts = async () => {
//     try {
//       if (!userId) return;
//       const response = await fetch(`${baseUrl}/flowcharts`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Userid": userId,
//         },
//       });

//       if (response.ok) {
//         const data: FlowchartsResponse = await response.json();

//         // Store response in state as a JSON string
//         setFetchedFlowcharts(JSON.stringify(data, null, 2));
        
//         const decryptedFlowcharts = data.flowcharts.map(decryptFlowchartData);
//         setFlowchartsArray(decryptedFlowcharts);

//       } else {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//     } catch (error) {
//       console.log("Error fetching flowcharts in child component:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   console.log("flowchartsArray : ", flowchartsArray);

//   // Fetch data when dependencies change
//   useEffect(() => {
//     if (userId) {
//       fetchFlowcharts();
//     }
//   }, [userId, onCreateFlowchart, refetchChildComponent]);


// const openFlowchartDetails = (flowchart: FlowchartItem) => {
//   setSelectedFlowchart(flowchart);
// };

// // ✅ Close flowchart details and show the list again
// const closeFlowchartDetails = () => {
//   setSelectedFlowchart(null);
// };

//   return (
//     <div>
//       {fetchedFlowcharts ? (
//         <ul className="cssFlowchartsGrid grid grid-cols-4 gap-4 max-h-full overflow-y-scroll">
//           {loading ? (
//             <FlowchartsSkeleton />
//           ) : flowchartsArray.length > 0 ? (
//             flowchartsArray.map((flowchart) => (
//               <li
//                 key={flowchart.uniqueId}
//                 // onClick={() => openPopup(flowchart)}
//                 className={`${returnBg(
//                   flowchart.color
//                 )} border w-46 h-32 rounded-lg p-4 select-none cursor-pointer hover:bg-opacity-50`}
//               >
//                 <h4 className="text-slate-200 font-semibold text-lgFont relative top-2/3 w-4/5 h-10 truncate">
//                   {flowchart.title}
//                 </h4>
//               </li>
//             ))
//           ) : (
//             <p className="text-mdFont text-slate-400 w-[72vw] flex items-center">
//               Start making flowcharts by clicking + icon
//             </p>
//           )}
//         </ul>
//       ) : (
//         <div className="cssFlowchartsGrid grid grid-cols-4 gap-4 max-h-full overflow-y-scroll">
//           <FlowchartsSkeleton />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Flowcharts;
















import { useEffect, useState } from "react";
import FlowchartsSkeleton from "./flowchartsSkeleton";
import FlowchartDetails from "../flowchartDetails/page"; // ✅ Import child component
import "./responsive.css";
import { decryptData } from "@/utils/cryptojs";

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
}

const baseUrl = "https://mind-maps-backend.onrender.com";
const localUrl = "http://localhost:8080"

const Flowcharts: React.FC<FlowchartsProps> = ({
  onCreateFlowchart,
  userId,
  refetchChildComponent,
  selectedColor
}) => {
  const [flowchartsArray, setFlowchartsArray] = useState<FlowchartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFlowchart, setSelectedFlowchart] = useState<FlowchartItem | null>(null); // ✅ Track selected flowchart

  const filteredFlowcharts = selectedColor === "allColor"
  ? flowchartsArray
  : flowchartsArray.filter(flowchart => flowchart.color === selectedColor);

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
    const topbar = document.getElementById("flowchartTopbar")
    topbar?.classList.add("hidden")
  };
  
  // ✅ Close flowchart details and show the list again
  const closeFlowchartDetails = () => {
    setSelectedFlowchart(null);
    const topbar = document.getElementById("flowchartTopbar")
    topbar?.classList.remove("hidden")
  };

  return (
    <div>
      {selectedFlowchart ? ( // ✅ Show FlowchartDetails if one is selected
        <FlowchartDetails flowchart={selectedFlowchart} onClose={closeFlowchartDetails} />
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
                )} border w-46 h-32 rounded-lg p-4 select-none cursor-pointer hover:bg-opacity-50`}
              >
                <h4 className="text-slate-200 font-semibold text-lgFont relative top-2/3 w-4/5 h-10 truncate">
                  {flowchart.title}
                </h4>
              </li>
            ))
          ) : (
            <p className="text-mdFont text-slate-400">
              Start making flowcharts by clicking + icon
            </p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Flowcharts;

