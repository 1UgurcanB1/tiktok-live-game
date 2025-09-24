import { Schema, model } from "mongoose";

const LeaderboardSchema = new Schema(
  {
    date: { type: String, index: true }, // YYYY-MM-DD
    entries: [{ userId: String, displayName: String, total: Number }],
  },
  { timestamps: true },
);

export default model("Leaderboard", LeaderboardSchema);
