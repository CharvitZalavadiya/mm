import { useState } from "react";
import "./responsive.css";

interface FlowchartDetailTopPanelProps {
  onClose: () => void;
  hasChanges: boolean;
  onSave: () => Promise<void>;
}

const FlowchartDetailTopPanel: React.FC<FlowchartDetailTopPanelProps> = ({
  onClose,
  hasChanges,
  onSave,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBackClick = () => {
    if (hasChanges) {
      setIsDialogOpen(true);
    } else {
      onClose();
    }
  };

  return (
    // <div className="p-[6px] pr-3 gap-3 flex items-center bg-selectedFunctionalityBackgroundColor rounded-full">
    //   <button
    //     onClick={onClose}
    //     className="bg-navBlockBackground select-none material-symbols-rounded p-1 rounded-full hover:bg-navBlockBackgroundHover transition"
    //   >
    //     chevron_left
    //   </button>
    //   <p>{flowchart.title}</p>
    // </div>
    // <div className="p-[6px] pr-3 gap-3 flex items-center bg-selectedFunctionalityBackgroundColor rounded-full">
    <>
      <button
        onClick={handleBackClick}
        className="bg-navBlockBackground select-none material-symbols-rounded p-1 rounded-full hover:bg-navBlockBackgroundHover transition"
      >
        chevron_left
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="cssFlowchartBackSaveDialogBox bg-noteBackground p-5 rounded-lg shadow-lg text-center w-auto">
            <p className="text-lg font-medium mb-4">
              You have unsaved changes.
              <br /> Do you want to save them?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  onSave().then(() => {
                    onClose();
                  });
                  setIsDialogOpen(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  onClose();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    // </div>
  );
};

export default FlowchartDetailTopPanel;
