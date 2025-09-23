import { Schema, model } from "mongoose";

const RoundSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", index: true },
    index: Number,
    prompt: String,
    options: [String],
    answer: Schema.Types.Mixed,
    durationMs: Number,
  },
  { timestamps: true },
);

export default model("Round", RoundSchema);
