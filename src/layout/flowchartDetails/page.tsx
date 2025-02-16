// const FlowchartDetails = () => {
//   return (
//     <div>
//       <p>123</p>
//     </div>
//   );
// };

// export default FlowchartDetails;









interface FlowchartDetailsProps {
    flowchart: any;
    onClose: () => void; // ✅ Close function from parent
  }
  
  const FlowchartDetails: React.FC<FlowchartDetailsProps> = ({ flowchart, onClose }) => {
    return (
      <div className="p-4 bg-gray-800 text-white rounded-lg">
        <button onClick={onClose} className="bg-red-500 px-3 py-1 rounded mb-3">⬅ Back</button>
        
        <h2 className="text-xl font-bold">{flowchart.title}</h2>
        <p><strong>Unique ID:</strong> {flowchart.uniqueId}</p>
        <p><strong>Color:</strong> {flowchart.color}</p>
  
        <h3 className="mt-4">Nodes:</h3>
        <ul>
          {flowchart.data.nodes.map((node: any) => (
            <li key={node.id}>
              <strong>{node.data.label}</strong> ({node.data.shape})
            </li>
          ))}
        </ul>
  
        <h3 className="mt-4">Edges:</h3>
        <ul>
          {flowchart.data.edges.map((edge: any) => (
            <li key={edge.id}>
              {edge.source} → {edge.target}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default FlowchartDetails;
  