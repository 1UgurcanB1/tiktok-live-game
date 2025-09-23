import { Schema, model } from "mongoose";

const ScoreSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", index: true },
    roundIndex: Number,
    userId: String,
    displayName: String,
    delta: Number,
    total: Number,
  },
  { timestamps: true },
);

ScoreSchema.index({ sessionId: 1, roundIndex: 1, total: -1 });

export default model("Score", ScoreSchema);
