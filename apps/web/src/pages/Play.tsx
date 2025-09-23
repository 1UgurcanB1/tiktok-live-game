import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../app/store/game.store";
import PageTransition from "../components/PageTransition";

export default function Play() {
  const nav = useNavigate();
  const { selected, currentRound, totalRounds } = useGameStore();
  const roundMs = useMemo(
    () => selected?.defaultRoundDurationMs ?? 30_000,
    [selected],
  );
  const [left, setLeft] = useState(roundMs);

  useEffect(() => {
    // mock ตัวจับเวลาในรอบนี้
    const start = performance.now();
    const t = window.setInterval(() => {
      const remain = Math.max(roundMs - (performance.now() - start), 0);
      setLeft(remain);
      if (remain === 0) {
        clearInterval(t);
        nav("/summary");
      }
    }, 100);
    return () => clearInterval(t);
  }, [nav, roundMs]);

  if (!selected) return <div className="p-6">ยังไม่ได้เลือกเกม</div>;

  return (
    <PageTransition>
      <main className="p-6 max-w-3xl mx-auto">
        <header className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-bold">{selected.name}</h2>
          <span className="opacity-70">
            รอบ {currentRound}/{totalRounds}
          </span>
        </header>

        <section className="rounded-2xl border p-6 space-y-4">
          <p className="text-lg">คำถาม/โจทย์ของรอบนี้ (mock)</p>
          <div className="h-2 w-full bg-black/10 rounded">
            <div
              className="h-2 bg-black/60 rounded"
              style={{ width: `${((roundMs - left) / roundMs) * 100}%` }}
            />
          </div>
          <p className="opacity-70">เหลือเวลา {Math.ceil(left / 1000)}s</p>
          <button
            className="px-3 py-2 rounded-xl shadow"
            onClick={() => nav("/summary")}
          >
            จบรอบ (ทดสอบ)
          </button>
        </section>
      </main>
    </PageTransition>
  );
}
