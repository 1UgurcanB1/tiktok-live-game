import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import TimedProgressBar from "../components/TimedProgressBar";
import { DEFAULT_TIMERS, GAMES } from "@tiktok/constants";
import { fairSampleByKey } from "@tiktok/utils";
import type { GameConfig } from "@tiktok/types";
import { events } from "../services/ws";
import { useGameStore } from "../app/store/game.store";
import SystemStatus from "../components/SystemStatus";
import { useTranslation } from "react-i18next";
import { localized } from "../lib/localize";

type GameItem = {
  order: number; // 0..5 แสดงตัวเลขนี้แทน id
  title: string;
  category: string; // ประเภทเกม
  votes: number;
  highlight?: boolean; // true = วงกลมลำดับสีส้ม
  onClick?: (order: number) => void;
};

export default function GameSelect() {
  const navigate = useNavigate();
  const setGame = useGameStore((s) => s.setGame);
  const { t, i18n } = useTranslation(["gameSelect", "common"]);

  // Keep lightweight recent history in localStorage to reduce repeats across sessions
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("game_recent_ids");
      const arr = raw ? (JSON.parse(raw) as string[]) : [];
      return Array.isArray(arr) ? arr.slice(-10) : [];
    } catch {
      return [];
    }
  });

  // Pick 5 fair-random games using recent history
  const selected = useMemo(
    () => fairSampleByKey<GameConfig, string>(GAMES, 5, (g) => g.id, recent, 8),
    [recent],
  );

  // Votes for options 0..5 (index 0 is random option)
  const [votes, setVotes] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  // Current highlighted leader (persist across ties); default to 0
  const [leaderOrder, setLeaderOrder] = useState<number>(0);

  // Build items for rendering with dynamic highlight based on current votes
  const games: GameItem[] = useMemo(() => {
    const arr: GameItem[] = [];
    // id 0: random option
    arr.push({
      order: 0,
      title: t("options.randomGame"),
      category: t("options.random"),
      votes: votes[0],
      // only one highlight at a time using leaderOrder from state
      highlight: leaderOrder === 0,
    });
    // ids 1..5 from selected games
    for (let i = 0; i < selected.length; i++) {
      const g = selected[i];
      const idx = i + 1;
      arr.push({
        order: idx,
        title: localized(g, "name"),
        category: localized(g, "categoryDescription"),
        votes: votes[idx],
        highlight: leaderOrder === idx,
      });
    }
    return arr;
    // maxVotes derived from votes; not needed in dependency list separately
  }, [leaderOrder, selected, votes, t, i18n.language]);

  // Update leaderOrder only when there is a unique leader; ignore ties
  useEffect(() => {
    const maxV = Math.max(...votes);
    const contenders = votes
      .map((v, i) => ({ v, i }))
      .filter(({ v }) => v === maxV)
      .map(({ i }) => i);
    if (contenders.length === 1) {
      const nextLeader = contenders[0] ?? 0;
      if (nextLeader !== leaderOrder) setLeaderOrder(nextLeader);
    }
    // else: do nothing on tie
  }, [votes, leaderOrder]);

  // Listen to TikTok chat votes (0-5)
  useEffect(() => {
    // Matches a single digit 0-5 that is not part of a longer number:
    // (?:^|\D)  => start of string or a non-digit boundary before the digit
    // ([0-5])    => capture the vote digit (allowed range)
    // (?!\d)    => ensure it's not immediately followed by another digit
    const VOTE_DIGIT_REGEX = /(?:^|\D)([0-5])(?!\d)/;
    const off = events.on("tiktok.chat", (ev: unknown) => {
      try {
        const msg = ev as { data?: { comment?: string } };
        const text = msg?.data?.comment ?? "";
        const m = VOTE_DIGIT_REGEX.exec(text);
        if (!m) return;
        const n = Number(m[1]);
        if (n >= 0 && n <= 5) {
          setVotes((vs) => {
            const next = vs.slice();
            next[n] += 1;
            return next;
          });
        }
      } catch {
        // ignore malformed
      }
    });
    return () => off();
  }, []);

  // Optional: allow tapping a pill to simulate a vote (useful for manual testing)
  const handleClick = (order: GameItem["order"]) => {
    if (typeof order === "number" && order >= 0 && order <= 5) {
      setVotes((vs) => {
        const next = vs.slice();
        next[order] += 1;
        return next;
      });
    }
  };

  // When timer completes: choose winner and go to rules
  const onComplete = () => {
    // find all ids with max votes (include 0 if tied)
    const maxV = Math.max(...votes);
    const contenders: number[] = votes
      .map((v, i) => ({ v, i }))
      .filter(({ v }) => v === maxV)
      .map(({ i }) => i);

    const winnerId = contenders.length
      ? contenders[Math.floor(Math.random() * contenders.length)]
      : 0; // if no votes at all, treat as 0 (random)

    let chosen = null as null | (typeof selected)[number];
    if (winnerId === 0) {
      // random among 1..5
      chosen = selected[Math.floor(Math.random() * selected.length)] ?? null;
    } else {
      const idx = winnerId - 1; // map 1..5 to 0..4
      chosen = selected[idx] ?? null;
    }

    if (chosen) {
      setGame(chosen);
      try {
        const nextRecent = [...recent, chosen.id].slice(-12);
        setRecent(nextRecent);
        localStorage.setItem("game_recent_ids", JSON.stringify(nextRecent));
      } catch {
        // ignore storage errors
      }
    }
    navigate("/rules");
  };

  return (
    <div className="h-full w-full">
      <div className="w-full flex items-center gap-6">
        <TimedProgressBar
          duration={DEFAULT_TIMERS.selectGameMs}
          onComplete={onComplete}
          className="flex-1"
          trackClassName="bg-white/20"
          barClassName="bg-tangerine-pop"
        />
        <SystemStatus />
      </div>
      <PageTransition className="gap-5 py-6">
        <div className="flex flex-col">
          {/* Header strip */}
          <h2 className="text-3xl text-white text-center font-extrabold">
            {t("header.title")}
          </h2>
          <h4 className="text-xl text-arctic-sky text-center">
            {t("header.subtitle")}
          </h4>
          <hr className="mt-6" />

          {/* Body */}
          <div className="p-5 space-y-5">
            {games.map((g) => (
              <button
                key={g.order}
                onClick={() => (g.onClick ?? handleClick)(g.order)}
                className="w-full text-left group"
              >
                {/* meta */}
                <div className="px-2 text-lg text-[#a7d3ff]/90 flex items-center gap-4 mb-1">
                  <span>
                    <span className="opacity-80">{t("meta.category")}:</span>{" "}
                    <span className="font-semibold">{g.category}</span>
                  </span>
                  <span className="opacity-80">
                    {t("meta.votes")}:{" "}
                    <span className="font-semibold text-white">{g.votes}</span>
                  </span>
                </div>

                {/* pill */}
                <div className="relative bg-black text-white rounded-full h-14 flex items-center pl-16 pr-5 transition-transform duration-150 group-active:scale-[0.98]">
                  {/* index bubble */}
                  <div
                    className={[
                      "absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full grid place-items-center text-[#1b2a52] font-extrabold text-4xl",
                      g.highlight ? "bg-[#ffa654]" : "bg-[#b9dcff]",
                    ].join(" ")}
                  >
                    {g.order}
                  </div>

                  {/* title */}
                  <div className="font-medium text-lg tracking-wide truncate">
                    {g.title}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </PageTransition>
    </div>
  );
}

// Removed duplicated local sampling helpers; using fairSampleByKey from @tiktok/utils
