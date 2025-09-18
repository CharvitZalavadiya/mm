import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAIFlowchart } from "../../utils/useAIFlowchart";
import React from "react";

const FlowchartAiBox = ({ onFlowchartGenerated }: { onFlowchartGenerated?: (data: any) => void }) => {
    const [prompt, setPrompt] = useState("");
    const { generateFlowchartFromPrompt, clearFlowchartData, isLoading, error, flowchartData } = useAIFlowchart();

    const handleGenerate = async () => {
        await generateFlowchartFromPrompt(prompt);
    };

    // When flowchart data is generated, pass it to parent component
    React.useEffect(() => {
        if (flowchartData && onFlowchartGenerated) {
            onFlowchartGenerated(flowchartData);
            // Clear the data immediately after processing to prevent infinite loops
            clearFlowchartData();
        }
    }, [flowchartData, clearFlowchartData]); // Include clearFlowchartData in dependencies

    return (
        <div className="cssParentControlBar bg-selectedFunctionalityBackgroundColor flex items-center backdrop-blur-xl rounded-full shadow-2xl p-2 gap-2">
            <input 
                type="text" 
                name="FlowchartAiInput" 
                id="FlowchartAiInput" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                placeholder="Describe your flowchart..."
                disabled={isLoading}
                className="bg-selectedFunctionalityBackgroundColor rounded-full w-full border border-navBlockBackgroundHover px-3 outline-none caret-gray-400 text-smFont" 
            />
            
            <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className={`cssControlBarActionButtons w-8 flex items-center justify-center gap-2 p-1 ${
                    isLoading ? 'bg-gray-600' : 'bg-gray-500 hover:bg-gray-400'
                } text-white text-sm rounded-full disabled:opacity-50`}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <ArrowRight className="cssControlBarActionButtonIcon w-5 h-5 rounded-full outline-none" />
                )}
            </button>
        </div>
    )
}

export default FlowchartAiBox;