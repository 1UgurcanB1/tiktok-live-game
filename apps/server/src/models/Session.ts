import { Schema, model } from "mongoose";

const SessionSchema = new Schema(
  {
    gameId: { type: String, index: true },
    status: {
      type: String,
      enum: [
        "idle",
        "select",
        "rules",
        "playing",
        "round_summary",
        "scoreboard",
        "support",
        "ended",
      ],
      index: true,
    },
    currentRound: { type: Number, default: 0 },
    totalRounds: { type: Number, default: 10 },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  { timestamps: true },
);

export default model("Session", SessionSchema);
