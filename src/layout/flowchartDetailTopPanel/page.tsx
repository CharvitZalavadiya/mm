interface FlowchartDetailTopPanelProps {
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
}

const FlowchartDetailTopPanel: React.FC<FlowchartDetailTopPanelProps> = ({
  flowchart,
  onClose,
}) => {
  return (
    <div className="p-[6px] pr-3 gap-3 flex items-center bg-selectedFunctionalityBackgroundColor rounded-full">
      <button
        onClick={onClose}
        className="bg-navBlockBackground select-none material-symbols-rounded p-1 rounded-full hover:bg-navBlockBackgroundHover transition"
      >
        chevron_left
      </button>
      <p>{flowchart.title}</p>
    </div>
  );
};

export default FlowchartDetailTopPanel;
