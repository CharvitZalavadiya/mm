import React from "react";
import { Download, Upload, Trash } from "lucide-react";

interface Color {
  hex: string;
  name: string;
}

interface ShapeIcon {
  shape: string;
  IconComponent: React.ElementType;
}

interface ControlPanelProps {
  onAddNode: (shape: string) => void;
  onColorChange: (color: string) => void;
  selectedNode: any;
  onDelete: () => void;
  colorPalette: Record<string, Color>;
  shapeIcons: ShapeIcon[];
  hasChanges: boolean;
  onSave: () => void;
}

const FlowchartControlPanel: React.FC<ControlPanelProps> = ({
  onAddNode,
  onColorChange,
  selectedNode,
  onDelete,
  colorPalette,
  shapeIcons,
  hasChanges,
  onSave
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
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Change Color
        </h3>
        <div className="grid grid-cols-3 gap-3 pb-3 border-b border-gray-500">
          {Object.entries(colorPalette).map(([key, { hex }]) => (
            <button
              key={key}
              className={`w-5 h-5 rounded-full border ${
                selectedNode?.data?.color === hex ? "ring-1 ring-white" : ""
              }`}
              style={{ backgroundColor: hex }}
              onClick={() => onColorChange(hex)}
            />
          ))}
        </div>
      </div>

      {/* Shape Selection */}

      <div className="">
        <h3 className="text-sm font-medium text-gray-300 my-3">Add Shape</h3>
        <div className="flex justify-between pb-3 border-b border-gray-500">
          {shapeIcons.map(({ shape, IconComponent }) => (
            <button
              key={shape}
              className={`p-2 rounded border-navBlockBackgroundHover bg-zinc-500 ${
                selectedNode?.data?.shape === shape ? "ring-1 ring-white" : ""
              }`}
              onClick={() => onAddNode(shape)}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </button>
          ))}
        </div>
      </div>

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
        // <div className="mt-6 pb-4 border-b border-gray-500">
        <button
          onClick={onDelete}
          className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-sm text-white font-semibold rounded-lg"
        >
          {/* <Trash className="w-3 h-3" /> */}
          <span>Remove</span>
        </button>
        // </div>
      )}
      {selectedNode === null && (
        // <div className="mt-6 pb-4 border-b border-gray-700">
          <button
          onClick={onDelete}
          className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg"
        >
            {/* <Trash className="w-5 h-5" /> */}
            <span>Remove</span>
          </button>
          
        // </div>
        
      )}

      {/* save button */}
      <button
          onClick={onSave}
          disabled={!hasChanges}
          className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg"
        >
            {/* <Trash className="w-5 h-5" /> */}
            <span>Save</span>
          </button>
    </div>
  );
};

export default FlowchartControlPanel;
