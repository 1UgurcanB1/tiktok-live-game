import type { PageTimers, GameConfig } from "@tiktok/types";

export const DEFAULT_TIMERS: PageTimers = {
  selectGameMs: 3 * 60_000,
  rulesMs: 60_000,
  roundSummaryMs: 30_000,
  scoreboardMs: 60_000,
  supportMs: 60_000,
};

export const GAMES: GameConfig[] = [
  {
    id: "guessWordTH",
    name: "ทายคำภาษาไทย",
    category: "guessWord",
    categoryDescription: "ทายคำ",
    description: "",
    defaultRounds: 10,
    defaultRoundDurationMs: 40_000,
    gameImage: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
    rules: [
      "เกมนี้จะมีคำศัพท์ภาษาไทยให้ทายทั้งหมด 10 คำ",
      "ผู้เล่นจะต้องทายคำศัพท์ให้ถูกต้องภายในเวลาที่กำหนด",
    ],
  }
];
