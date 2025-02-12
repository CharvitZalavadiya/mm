// import { useEffect, useState } from "react";

// interface FlowchartsProps {
//   onCreateFlowchart: () => void;
//   userId: string;
//   refetchChildComponent: boolean;
// }

// const baseUrl = "https://mind-maps-backend.onrender.com";
// const localUrl = "http://localhost:8080";

// const Flowcharts: React.FC<FlowchartsProps> = ({
//   onCreateFlowchart,
//   userId,
//   refetchChildComponent,
// }) => {

//   const [fetchedFlowcharts, setFetchedFlowcharts] = useState({})

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
//         const data = await response.json();
//         console.log("Fetched flowcharts in layouts : ", data);
//       } else {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//     } catch (error) {
//       console.log("error fetching flowcharts in child component : ", error);
//     }
//   };

//   console.log(fetchFlowcharts)

//   useEffect(() => {
//     if (userId) {
//       fetchFlowcharts();
//     }
//   }, [userId, onCreateFlowchart, refetchChildComponent]);

//   return (
//     <div>
//       <span>{userId}</span>
//     </div>
//   );
// };

// export default Flowcharts;














import { useEffect, useState } from "react";

interface Flowchart {
  uniqueId: string;
  title: string;
  color: string;
  data: object;
}

interface FlowchartsResponse {
  _id: string;
  userId: string;
  flowcharts: Flowchart[];
}

interface FlowchartsProps {
  onCreateFlowchart: () => void;
  userId: string;
  refetchChildComponent: boolean;
}

const baseUrl = "https://mind-maps-backend.onrender.com";

const Flowcharts: React.FC<FlowchartsProps> = ({
  onCreateFlowchart,
  userId,
  refetchChildComponent,
}) => {
  // ✅ State to store fetched flowcharts (as JSON string)
  const [fetchedFlowcharts, setFetchedFlowcharts] = useState<string>("");

  // ✅ Function to fetch flowcharts
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
        console.log("Fetched flowcharts in layouts:", data);

        // ✅ Store response in state as a JSON string
        setFetchedFlowcharts(JSON.stringify(data, null, 2));
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.log("Error fetching flowcharts in child component:", error);
    }
  };

  // ✅ Fetch data when dependencies change
  useEffect(() => {
    if (userId) {
      fetchFlowcharts();
    }
  }, [userId, onCreateFlowchart, refetchChildComponent]);

  return (
    <div>
      <span>User ID: {userId}</span>
      <h3>Fetched Flowcharts:</h3>
      {fetchedFlowcharts ? (
        <pre>{fetchedFlowcharts}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Flowcharts;
