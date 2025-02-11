interface FlowchartsProps {
  onCreateFlowchart: () => void;
}

const Flowcharts: React.FC<FlowchartsProps> = ({ onCreateFlowchart }) => {
  return (
    <div>
      <span>onCreateFlowchart</span>
    </div>
  );
};

export default Flowcharts;
