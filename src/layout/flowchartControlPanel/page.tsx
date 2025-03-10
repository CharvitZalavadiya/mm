import React from "react";
import { Download, Upload, Trash } from "lucide-react";

interface Color {
  hex: string;
  name: string;
}

interface ControlPanelProps {
  onAddNode: (shape: string) => void;
  onColorChange: (color: string) => void;
  selectedNode: any;
  onDelete: () => void;
//   onExport: () => void;
//   onImport: () => void;
//   onUndo: () => void;
//   onRedo: () => void;
//   disableUndo: boolean;
//   disableRedo: boolean;
  colorPalette: Record<string, Color>;
//   shapeIcons: Record<string, React.ReactNode>;
}

const FlowchartControlPanel: React.FC<ControlPanelProps> = ({
  onAddNode,
  onColorChange,
  selectedNode,
  onDelete,
//   onExport,
//   onImport,
//   onUndo,
//   onRedo,
//   disableUndo,
//   disableRedo,
  colorPalette,
//   shapeIcons,
}) => {
  return (
    <div className="bg-selectedFunctionalityBackgroundColor backdrop-blur-xl rounded-lg shadow-2xl border border-navBlockBackgroundHover p-3">
      {/* Header */}
      {/* <div className="flex items-center justify-between pb-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Flow Builder</h2>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        </div>
      </div> */}

      {/* Color Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Color Palette</h3>
        <div className="grid grid-cols-3 gap-3 pb-3 border-b border-gray-500">
          {Object.entries(colorPalette).map(([key, { hex }]) => (
            <button
              key={key}
              className={`w-5 h-5 rounded-full border ${
                selectedNode?.data?.color === hex ? "ring-3 ring-white" : ""
              }`}
              style={{ backgroundColor: hex }}
              onClick={() => onColorChange(hex)}
            />
          ))}
        </div>
      </div>

      {/* Shape Selection */}
      {/* <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Add Shape</h3>
        <div className="grid grid-cols-2 gap-3 pb-4 border-b border-gray-700">
          {Object.keys(shapeIcons).map((shape) => (
            <button
              key={shape}
              className={`p-2 rounded border ${
                selectedNode?.data?.shape === shape ? "ring-2 ring-white" : ""
              }`}
              onClick={() => onAddNode(shape)}
            >
              {shapeIcons[shape]}
            </button>
          ))}
        </div>
      </div> */}

      {/* Export/Import Buttons */}
      {/* <div className="mt-6 pb-4 border-b border-gray-700">
        <button
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
        >
          <Download className="w-5 h-5" />
          <span>Export</span>
        </button>
        <button
          onClick={onImport}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg mt-2"
        >
          <Upload className="w-5 h-5" />
          <span>Import</span>
        </button>
      </div> */}

      {/* Delete Button */}
      {selectedNode && (
        <div className="mt-6 pb-4 border-b border-gray-700">
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
          >
            <Trash className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Footer */}
      {/* <div className="flex items-center justify-between pb-4 border-b border-gray-700">
        <h2 className="text-sm mt-5 font-light text-white">
          Made with <a href="#">React-Flow Library</a>
        </h2>
      </div> */}
    </div>
  );
};

export default FlowchartControlPanel;