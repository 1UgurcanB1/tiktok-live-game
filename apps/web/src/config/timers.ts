import type { PageTimers } from "@tiktok/types";

export const DEFAULT_TIMERS: PageTimers = {
  selectGameMs: 3 * 60_000,
  rulesMs: 60_000,
  roundSummaryMs: 30_000,
  scoreboardMs: 60_000,
  supportMs: 60_000,
};
