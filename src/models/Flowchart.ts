import mongoose, { Document, Model, Schema } from "mongoose";

interface IFlowchart extends Document {
  userId: string;
  flowcharts: object;
  uniqueId: string;
  title: string;
  color: string;
  data: object;
}

const FlowchartSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    flowcharts: [
      {
        uniqueId: {type: String, required: true},
        title: { type: String, required: true },
        color: { type: String, required: true },
        data: { type: Object, required: true }, // This will store the JSON structure of each flowchart
      },
    ],
  },
  { timestamps: true }
);

const Flowchart: Model<IFlowchart> =
  mongoose.models.Flowchart ||
  mongoose.model<IFlowchart>("Flowchart", FlowchartSchema);

export default Flowchart;
