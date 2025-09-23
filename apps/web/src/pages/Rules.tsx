import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_TIMERS } from "../config/timers";
import { useGameStore } from "../app/store/game.store";
import PageTransition from "../components/PageTransition";

export default function Rules() {
  const nav = useNavigate();
  const { selected } = useGameStore();
  const ms = useMemo(
    () => selected?.timersOverride?.rulesMs ?? DEFAULT_TIMERS.rulesMs,
    [selected],
  );

  useEffect(() => {
    if (!selected) return;
    const id = window.setTimeout(() => nav("/play"), ms);
    return () => clearTimeout(id);
  }, [ms, nav, selected]);

  if (!selected) {
    return (
      <main className="p-6">
        <p>
          ยังไม่ได้เลือกเกม →{" "}
          <button className="underline" onClick={() => nav("/select")}>
            กลับไปเลือก
          </button>
        </p>
      </main>
    );
  }

  return (
    <PageTransition>
      <main className="p-6 max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">กฏการเล่น — {selected.name}</h2>
        <ol className="list-decimal pl-6 space-y-2 opacity-80">
          <li>เกมนี้มี {selected.defaultRounds} รอบ</li>
          <li>ตอบในแชทให้เร็วที่สุด</li>
          <li>ระบบจะสรุปคะแนนหลังจบแต่ละรอบ</li>
        </ol>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-xl shadow"
            onClick={() => nav("/play")}
          >
            เริ่มเลย
          </button>
          <p className="opacity-60 self-center">
            จะไปต่ออัตโนมัติใน {Math.ceil(ms / 1000)}s
          </p>
        </div>
      </main>
    </PageTransition>
  );
}
