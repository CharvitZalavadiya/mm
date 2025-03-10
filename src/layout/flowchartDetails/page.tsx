import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType
} from "@xyflow/react";
import {
  Circle,
  Square,
  Diamond,
  Triangle,
  Download, 
  Upload,
  Undo, 
  Redo,
  Plus,
  Palette,
  X,
  Trash,
  Pin,
  
  ChevronDown,
} from "lucide-react";

import "@xyflow/react/dist/style.css";
import FlowchartDetailTopPanel from "../flowchartDetailTopPanel/page";
import "./style.css";
import FlowchartControlPanel from "../flowchartControlPanel/page";

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

interface FlowchartNode {
  id: string;
  position: { x: number; y: number };
  data: { label: string; shape: string; color: string };
}

interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  // markerEnd?: { type: string }; // Uncomment if needed
}

const colorPalette = {
  pink: { hex: "#ec4899b3", name: "Pink" },
  green: { hex: "#22c55eb3", name: "Green" },
  yellow: { hex: "#eab308b3", name: "Yellow" },
  purple: { hex: "#a855f780", name: "Purple" },
  red: { hex: "#ef4444b3", name: "Red" },
  cyan: { hex: "#06b6d4b3", name: "Cyan" },
};

// const shapeIcons: Record<string, React.ReactNode> = {
//   circle: Circle,
//   rectangle: Square,
// };

// const nodeTypes = {
//   custom: (props) => <CustomNode {...props} />,
// };

const FlowchartDetails: React.FC<FlowchartDetailsProps> = ({
  flowchart,
  onClose,
}) => {
  const initialNodes = flowchart.data.nodes;

  const initialEdges = flowchart.data.edges;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<FlowchartEdge | null>(null);

  useEffect(() => {
    const minimap = document.getElementsByClassName("react-flow__minimap-svg");

    if (minimap.length > 0) {
      minimap[0].classList.add(
        "bg-selectedFunctionalityBackgroundColor",
        "rounded-lg"
      );
    }
  }, []);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((node: FlowchartNode) => {
    setSelectedNode(node);
    setSelectedEdge(null); // Reset edge selection when a node is clicked
  }, []);

  const handleEdgeClick = useCallback((edge: FlowchartEdge) => {
    setSelectedEdge(edge);
    setSelectedNode(null); // Reset node selection when an edge is clicked
  }, []);

  const handleNameChange = (id: String, newName: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newName } }
          : node
      )
    );
  };

  const addNode = (shape: any) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { 
        x: Math.random() * 500, 
        y: Math.random() * 300 
      },
      data: { 
        label: `${shape} ${nodes.length + 1}`,
        shape: shape,
        color: colorPalette.green.hex,
        onNameChange: handleNameChange,
      },
      type: 'custom',
      width: shape === 'circle' ? 100 : 160, // Initial width
      height: shape === 'circle' ? 100 : 80, // Initial height
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleColorChange = (color: string) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, color } }
            : node
        )
      );
      setSelectedNode({
        ...selectedNode,
        data: { ...selectedNode.data, color }
      });
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setSelectedNode(null);
    }
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  };

  return (
    <div className="w-full h-[90dvh] bg-canvasBackground text-white rounded-lg shadow-lg border border-navBlockBackgroundHover">
      <span className="bg-canvasBackground">
        <ReactFlow
          className="bg-canvasBackground"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // onNodeClick={handleNodeClick}
          // onEdgeClick={handleEdgeClick}
          // nodeTypes={nodeTypes}
          fitView
        >
          <Background gap={12} size={1} />
          <Panel position="top-center">
            <FlowchartDetailTopPanel flowchart={flowchart} onClose={onClose} />
          </Panel>
          <Controls className="bg-selectedFunctionalityBackgroundColor border border-navBlockBackgroundHover rounded-full p-2" />
          <MiniMap
            className="bg-selectedFunctionalityBackgroundColor border border-navBlockBackgroundHover rounded-lg"
            nodeColor={(node) => String(node.data.color)}
            maskColor={"#363636"}
          />
          <Panel position="top-left">
            <FlowchartControlPanel
              onAddNode={addNode}
              onColorChange={handleColorChange}
              selectedNode={selectedNode}
              onDelete={handleDelete}
              colorPalette={colorPalette}
              // shapeIcons={shapeIcons}
              // onExport={handleExport}
              // onImport={handleImport}
            />
          </Panel>
        </ReactFlow>
      </span>
    </div>
  );
};

export default FlowchartDetails;
