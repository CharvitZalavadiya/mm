import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Generate unique IDs
function generateUniqueId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface FlowchartNode {
  id: string;
  position: { x: number; y: number };
  data: { 
    label: string; 
    shape: string; 
    color: string; 
    onNameChange?: any; // This will be added by your UI
  };
  type: string;
  width: number;
  height: number;
}

interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
}

interface FlowchartResponse {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}

export async function generateFlowchart(userPrompt: string): Promise<FlowchartResponse> {
  try {
    const systemPrompt = `You are a flowchart generator. Create a JSON response with nodes and edges based on the user's description.
    
    Return ONLY valid JSON in this exact format:
    {
      "nodes": [
        {
          "id": "1",
          "position": { "x": 100, "y": 100 },
          "data": {
            "label": "Start",
            "shape": "circle",
            "color": "#22c55e"
          }
        }
      ],
      "edges": [
        {
          "source": "1",
          "target": "2",
          "id": "xy-edge__1-2"
        }
      ]
    }
    
    Rules:
    - Use shape "circle" for start/end nodes, "rectangle" for process nodes
    - Use ONLY these exact colors: "#ec4899" (pink), "#22c55e" (green), "#eab308" (yellow), "#a855f7" (purple), "#ef4444" (red), "#06b6d4" (cyan)
    - Position nodes with adequate spacing (100+ pixels apart)
    - Create logical flow with proper connections
    - Keep labels concise (max 20 characters)
    - Edge IDs should follow format: xy-edge__source-target`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Create a flowchart for: ${userPrompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error("No response from AI model");
    }

    // Parse JSON response
    const flowchartData = JSON.parse(response) as FlowchartResponse;
    
    // Validate the response structure
    if (!flowchartData.nodes || !Array.isArray(flowchartData.nodes)) {
      throw new Error("Invalid response: missing or invalid nodes array");
    }
    
    if (!flowchartData.edges || !Array.isArray(flowchartData.edges)) {
      throw new Error("Invalid response: missing or invalid edges array");
    }

    // Generate unique IDs to prevent conflicts
    const nodeIdMap = new Map<string, string>();
    
    // Process nodes with unique IDs and complete structure like your existing nodes
    const processedNodes = flowchartData.nodes.map(node => {
      const newId = generateUniqueId('');
      nodeIdMap.set(node.id, newId);
      return {
        id: newId,
        position: node.position,
        data: {
          label: node.data.label,
          shape: node.data.shape,
          color: node.data.color,
        },
        type: "custom",
        width: node.data.shape === "circle" ? 70 : 100,
        height: node.data.shape === "circle" ? 70 : 50,
      };
    });

    // Process edges with your specific format: xy-edge__source-target
    const processedEdges = flowchartData.edges.map(edge => {
      const sourceId = nodeIdMap.get(edge.source) || edge.source;
      const targetId = nodeIdMap.get(edge.target) || edge.target;
      return {
        source: sourceId,
        target: targetId,
        id: `xy-edge__${sourceId}-${targetId}`
      };
    });

    return {
      nodes: processedNodes,
      edges: processedEdges
    };

  } catch (error) {
    console.error("Error generating flowchart:", error);
    
    // Return a fallback simple flowchart with complete structure
    const errorNodeId = generateUniqueId('');
    return {
      nodes: [
        {
          id: errorNodeId,
          position: { x: 100, y: 100 },
          data: {
            label: "Error",
            shape: "circle",
            color: "#ef4444"
          },
          type: "custom",
          width: 70,
          height: 70
        }
      ],
      edges: []
    };
  }
}

export async function testAIConnection(): Promise<boolean> {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: "Respond with just: OK"
        }
      ],
      max_tokens: 10
    });

    return completion.choices[0]?.message?.content?.includes("OK") || false;
  } catch (error) {
    console.error("AI connection test failed:", error);
    return false;
  }
}
