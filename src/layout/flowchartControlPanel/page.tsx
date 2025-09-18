import React from "react";
import { Trash, Save } from "lucide-react";
import "./responsive.css"

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
  onSave,
}) => {
  return (
    <div className="cssParentControlBar bg-selectedFunctionalityBackgroundColor flex items-center gap-3 backdrop-blur-xl rounded-full shadow-2xl border border-navBlockBackgroundHover py-1 px-2">
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
        {/* <h3 className="text-sm font-medium text-gray-300 mb-3">Node Color</h3> */}
        <div className="grid grid-cols-6 gap-2 border-gray-500">
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

      <div className="cssControlBarMainSepator bg-gray-500 w-[2px] h-8 rounded-full"></div>

          <div className="flex gap-3">

          
      {/* Shape Selection */}

      <div className="flex flex-col justify-between">
        {/* <h3 className="text-sm font-medium text-gray-300 mb-3">Add Shape</h3> */}
        <div className="grid grid-cols-2 gap-2 border-gray-500">
          {shapeIcons.map(({ shape, IconComponent }) => (
            <button
              key={shape}
              className={`p-[6px] rounded-full border-navBlockBackgroundHover bg-zinc-500 ${
                selectedNode?.data?.shape === shape ? "ring-1 ring-white" : ""
              }`}
              onClick={() => onAddNode(shape)}
            >
              <IconComponent className="cssControlBarShapeButtons w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-500 w-[1px] h-8 rounded-full"></div>

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

      {/* action buttons */}
      <div className="flex gap-2">
        {/* Delete Button */}
        {selectedNode && (
          // <div className="mt-6 pb-4 border-b border-gray-500">
          <button
            onClick={onDelete}
            className="cssControlBarActionButtons w-full flex items-center justify-center gap-2 p-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full"
          >
            <Trash className="cssControlBarActionButtonIcon w-6 h-5" />
            {/* <span>Remove</span> */}
          </button>
          // </div>
        )}
        {selectedNode === null && (
          // <div className="mt-6 pb-4 border-b border-gray-700">
          <button
            onClick={onDelete}
            className="cssControlBarActionButtons w-full flex items-center justify-center gap-2 p-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full"
          >
            <Trash className="cssControlBarActionButtonIcon w-6 h-5" />
            {/* <span>Remove</span> */}
          </button>

          // </div>
        )}

        {/* save button */}
        <button
          onClick={onSave}
          disabled={!hasChanges}
          className="cssControlBarActionButtons w-full flex items-center justify-center gap-2 p-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-full"
        >
          <Save className="cssControlBarActionButtonIcon w-6 h-5" />
          {hasChanges && (
            <span className="absolute top-0 right-1 flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-600 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-cyan-500"></span>
          </span>
  )}
          {/* <span>Save</span> */}
        </button>
        </div>
      </div>
    </div>
  );
};

export default FlowchartControlPanel;