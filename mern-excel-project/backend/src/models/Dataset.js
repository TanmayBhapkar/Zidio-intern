import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    key: String,
    type: String,
  },
  { _id: false }
);

const datasetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true },
    originalFilename: { type: String },
    columns: [columnSchema],
    rows: { type: Array, default: [] },
    sizeBytes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Dataset", datasetSchema);
