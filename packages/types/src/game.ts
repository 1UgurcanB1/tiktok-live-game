/* =========================
 * TikTok Games
 * ========================= */

export type GameId = string; // เช่น "quiz", "emoji-race"

export interface PageTimers {
    selectGameMs: number; // 180000
    rulesMs: number; // 60000
    roundSummaryMs: number; // 30000
    scoreboardMs: number; // 60000
    supportMs: number; // 60000
}

export interface RoundSpec {
    index: number; // 1..N
    prompt: string; // ข้อคำถาม/โจทย์
    options?: string[]; // ถ้ามีตัวเลือก
    answer?: string | number | string[]; // สำหรับตรวจผล (แล้วแต่เกม)
    durationMs: number; // เวลาเล่นของรอบนี้
}

export interface GameConfig {
    id: GameId;
    name: string;
    description: string;
    defaultRounds: number; // 10–20
    defaultRoundDurationMs: number;
    /** optional category metadata for grouping/filtering in UI */
    category?: string;
    categoryDescription?: string;
    gameImage?: string; // URL or asset path
    /** optional static rules copy for UI */
    rules?: string[];
    timersOverride?: Partial<PageTimers>; // เฉพาะเกมนี้
}

export interface Session {
    _id: string;
    gameId: GameId;
    status: "idle" | "select" | "rules" | "playing" | "round_summary" | "scoreboard" | "support" | "ended";
    currentRound: number;
    totalRounds: number;
    startedAt: string; // ISO
}

export interface RoundResult {
    sessionId: string;
    roundIndex: number;
    stats: {
        correct?: number; wrong?: number; participants: number;
    };
    scores: Array<{ userId: string; displayName: string; delta: number; total: number }>; // ใช้รวมคะแนน
}

export interface LeaderboardEntry {
    userId: string; displayName: string; total: number;
}

export interface LeaderboardDaily {
    date: string; // YYYY-MM-DD
    entries: LeaderboardEntry[];
}
