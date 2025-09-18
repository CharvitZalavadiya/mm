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
  MarkerType,
  NodeResizer,
  Handle,
  Position,
  NodeMouseHandler,
} from "@xyflow/react";
import {
  Circle,
  Square,
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
import FlowchartAiBox from "../flowchartAiBox/page";
import axios from "axios";
import { encryptData } from "@/utils/cryptojs";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
// const baseUrl = "https://mind-maps-backend.onrender.com";
const localUrl = "http://localhost:56765";

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
        id: string;
      }[];
    };
  };
  onClose: () => void;
  fetchFlowcharts: () => Promise<void>;
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
}

const colorPalette = {
  pink: { hex: "#ec4899", name: "Pink" },
  green: { hex: "#22c55e", name: "Green" },
  yellow: { hex: "#eab308", name: "Yellow" },
  purple: { hex: "#a855f7", name: "Purple" },
  red: { hex: "#ef4444", name: "Red" },
  cyan: { hex: "#06b6d4", name: "Cyan" },
};

const shapeIcons: any = {
  circle: Circle,
  rectangle: Square,
};

const shapeIconsArray: { shape: string; IconComponent: React.ElementType }[] =
  Object.entries(shapeIcons).map(([shape, IconComponent]) => ({
    shape,
    IconComponent: IconComponent as React.ElementType,
  }));

const nodeTypes = {
  custom: (props: any) => <CustomNode {...props} />,
};

const CustomNode = ({ data, id, selected, width, height }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeName, setNodeName] = useState(data.label);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: any) => {
    setNodeName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (typeof data.onNameChange === "function") {
      data.onNameChange(id, nodeName);
    } else {
      console.warn(`onNameChange is not defined for node ${id}`);
    }
  };

  return (
    <div
      className="flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/10"
      style={{
        backgroundColor: data.color,
        width: width,
        height: height,
        borderRadius: data.shape === "circle" ? "50%" : "8px",
      }}
      onDoubleClick={handleDoubleClick}
    >
      {selected && <NodeResizer minWidth={50} minHeight={50} isVisible={selected} />}

      <div>
        {isEditing ? (
          <input
            type="text"
            value={nodeName}
            onChange={handleNameChange}
            onBlur={handleBlur}
            autoFocus
            className="bg-transparent border-none text-white text-center w-full outline-none"
          />
        ) : (
          <span className="text-white font-medium">{data.label}</span>
        )}
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white/50" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-white/50" />
    </div>
  );
};

const FlowchartDetails: React.FC<FlowchartDetailsProps> = ({ flowchart, onClose, fetchFlowcharts }) => {

  
  const handleNameChange = (id: string, newName: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: newName } } : node
      )
    );
  };


  const initialNodes = flowchart.data.nodes.map((node) => ({
    ...node,
    data: { ...node.data, onNameChange: handleNameChange },
  }));

  const initialEdges = flowchart.data.edges;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<FlowchartEdge | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const onConnect = useCallback(
    (params: any) => {setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds))
    setHasChanges(true);
  },
    [setEdges]
  );

  const handleNodeClick: NodeMouseHandler<FlowchartNode> = useCallback(
    (_event, node) => {
      setSelectedNode(node);
      setSelectedEdge(null);
      setHasChanges(true);
    },
    []
  );

  const handleEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: FlowchartEdge) => {
      setSelectedEdge(edge);
      setSelectedNode(null);
      setHasChanges(true);
    },
    []
  );

  const addNode = (shape: string) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      data: {
        label: `${shape} ${nodes.length + 1}`,
        shape: shape,
        color: colorPalette.green.hex,
        onNameChange: handleNameChange,
      },
      type: "custom",
      width: shape === "circle" ? 70 : 100,
      height: shape === "circle" ? 70 : 50,
    };
    setNodes((nds) => [...nds, newNode]);
    setHasChanges(true);
  };

  const handleColorChange = (color: string) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id ? { ...node, data: { ...node.data, color } } : node
        )
      );
      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, color } });
      setHasChanges(true);
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setSelectedNode(null);
      setHasChanges(true);
    }
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    try {
      const flowchartId = flowchart.uniqueId
      const flowchartColor = encryptData(flowchart.color)
      const flowchartTitle = encryptData(flowchart.title)
      const userId = localStorage.getItem("userId")

      const encryptedNodes = nodes.map(node => ({
        ...node,
        data: {
          label: encryptData(node.data.label),
          shape: encryptData(node.data.shape),
          color: encryptData(node.data.color)
        }
      }));

      await axios.patch(`${baseUrl}/flowcharts/${flowchart.uniqueId}`, {
        nodes: encryptedNodes,
        edges,
        flowchartId,
        flowchartColor,
        flowchartTitle,
        userId
      });
      console.log(`Flowchart saved successfully`)
      setHasChanges(false);
      fetchFlowcharts();
    } catch (error) {
      console.error("Error saving flowchart:", error);
      console.log("Failed to save flowchart.");
    } finally {
      fetchFlowcharts();
    }
  };

  return (
    <div className="w-full h-[90dvh] bg-canvasBackground text-white rounded-lg shadow-lg border border-navBlockBackgroundHover">
      <ReactFlow
        className="bg-canvasBackground text-[10px] truncate"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background gap={12} size={1} />
        <Panel position="top-left" className="text-smFont">
             <FlowchartDetailTopPanel onClose={onClose} hasChanges={hasChanges} onSave={handleSave} />
           </Panel>
        <Controls position="top-right" orientation="horizontal" className="bg-selectedFunctionalityBackgroundColor border border-navBlockBackgroundHover rounded-full p-1" />
        <Panel position="bottom-left">
            <FlowchartControlPanel
              onAddNode={addNode}
              onColorChange={handleColorChange}
              selectedNode={selectedNode}
              onDelete={handleDelete}
              colorPalette={colorPalette}
              shapeIcons={shapeIconsArray}
              hasChanges={hasChanges}
              onSave={handleSave}
              // onExport={handleExport}
              // onImport={handleImport}
            />
          </Panel>
          <Panel position="bottom-right">
            <FlowchartAiBox onFlowchartGenerated={(data) => {
        // Add the generated nodes and edges to your existing flowchart
        const newNodes = data.nodes.map((node: { data: any; }) => ({
            ...node,
            data: { ...node.data, onNameChange: handleNameChange }
        }));
        setNodes((nds) => [...nds, ...newNodes]);
        setEdges((eds) => [...eds, ...data.edges]);
        setHasChanges(true);
    }} />
          </Panel>
      </ReactFlow>
         
    </div>
  );
};

export default FlowchartDetails;
