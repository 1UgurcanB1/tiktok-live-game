import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_TIMERS } from "@tiktok/constants";
import { useGameStore } from "../app/store/game.store";
import PageTransition from "../components/PageTransition";

export default function RoundSummary() {
  const nav = useNavigate();
  const { currentRound, totalRounds, nextRound } = useGameStore();

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (currentRound < totalRounds) {
        nextRound();
        nav("/play");
      } else {
        nav("/scoreboard");
      }
    }, DEFAULT_TIMERS.roundSummaryMs);
    return () => clearTimeout(id);
  }, [currentRound, totalRounds, nextRound, nav]);

  return (
    <PageTransition>
      <main className="p-6 max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">สรุปรอบ {currentRound}</h2>
        <ul className="list-disc pl-6 opacity-80">
          <li>อันดับ/คะแนน (ตัวอย่าง)</li>
          <li>สถิติคำตอบถูก/ผิด</li>
        </ul>
        <p className="opacity-60">กำลังไปหน้าถัดไป…</p>
      </main>
    </PageTransition>
  );
}
