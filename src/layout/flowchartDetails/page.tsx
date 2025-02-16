import React, { useCallback, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import FlowchartDetailTopPanel from "../flowchartDetailTopPanel/page";

interface FlowchartDetailsProps {
  flowchart: {
    uniqueId: string;
    title: string;
    color: string;
    data: {
      nodes: {
        id: string;
        position: { x: number; y: number };
        data: { label: string; shape: string; color: string };
      }[];
      edges: {
        source: string;
        target: string;
        // markerEnd: { type: string };
        id: string;
      }[];
    };
  };
  onClose: () => void;
}

const FlowchartDetails: React.FC<FlowchartDetailsProps> = ({
  flowchart,
  onClose,
}) => {
  const initialNodes = flowchart.data.nodes;

  const initialEdges = flowchart.data.edges;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


    useEffect(() => {
        const minimap = document.getElementsByClassName("react-flow__minimap-svg");
        
        if (minimap.length > 0) {
          minimap[0].classList.add("bg-selectedFunctionalityBackgroundColor", "rounded-lg");
        }
      }, []);

  return (
    <div className="w-full h-[90dvh] bg-canvasBackground text-white rounded-lg shadow-lg border border-navBlockBackgroundHover">
      <span className="bg-canvasBackground">
        <ReactFlow
          className="bg-canvasBackground"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          //   onConnect={onConnect}
          //   onNodeClick={handleNodeClick}
          //   onEdgeClick={handleEdgeClick}
          //   nodeTypes={nodeTypes}
          fitView
        >
          <Background gap={12} size={1} />
          <Panel position="top-center">
            <FlowchartDetailTopPanel flowchart={flowchart} onClose={onClose} />
          </Panel>
          <Controls className="bg-selectedFunctionalityBackgroundColor border border-navBlockBackgroundHover rounded-full p-2" />
          <MiniMap
            className="bg-selectedFunctionalityBackgroundColor border rounded-lg"
            nodeColor={(node) => String(node.data.color)}
            maskColor={"#363636"}
          />
        </ReactFlow>
      </span>
    </div>
  );
};

export default FlowchartDetails;
