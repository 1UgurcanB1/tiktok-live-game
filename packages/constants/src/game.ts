import type { GameConfig } from "@tiktok/types";

import type { PageTimers } from "@tiktok/types";

export const DEFAULT_TIMERS: PageTimers = {
  selectGameMs: 3 * 60_000,
  rulesMs: 60_000,
  roundSummaryMs: 30_000,
  scoreboardMs: 60_000,
  supportMs: 60_000,
};

export const GAMES: GameConfig[] = [
  {
    id: "quiz",
    name: "Quiz สายฟ้า",
    description: "ตอบไว ได้แต้ม",
    defaultRounds: 10,
    defaultRoundDurationMs: 40_000,
  },
  {
    id: "emojirace",
    name: "Emoji Race",
    description: "ทายอีโมจิให้ถูก",
    defaultRounds: 15,
    defaultRoundDurationMs: 30_000,
    timersOverride: { rulesMs: 45_000 },
  },
];
