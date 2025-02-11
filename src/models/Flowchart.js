import mongoose from "mongoose";

const FlowchartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    flowcharts: [
      {
        uniqueId: { type: String, required: true },
        title: { type: String, required: true },
        color: { type: String, required: true },
        data: { type: Object, required: true }, // Stores JSON structure of each flowchart
      },
    ],
  },
  { timestamps: true }
);

const Flowchart = mongoose.models.Flowchart || mongoose.model("Flowchart", FlowchartSchema);

export default Flowchart;
