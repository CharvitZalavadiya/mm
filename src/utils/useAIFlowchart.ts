import { useState, useCallback } from 'react';
import { generateFlowchart } from './aiModel';

interface UseAIFlowchartReturn {
  generateFlowchartFromPrompt: (prompt: string) => Promise<void>;
  clearFlowchartData: () => void;
  isLoading: boolean;
  error: string | null;
  flowchartData: any | null;
}

export function useAIFlowchart(): UseAIFlowchartReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flowchartData, setFlowchartData] = useState<any | null>(null);

  const generateFlowchartFromPrompt = async (prompt: string) => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFlowchartData(null);

    try {
      const result = await generateFlowchart(prompt); // No encryption, normal readable data
      setFlowchartData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate flowchart");
    } finally {
      setIsLoading(false);
    }
  };

  const clearFlowchartData = useCallback(() => {
    setFlowchartData(null);
    setError(null);
  }, []);

  return {
    generateFlowchartFromPrompt,
    clearFlowchartData,
    isLoading,
    error,
    flowchartData
  };
}
