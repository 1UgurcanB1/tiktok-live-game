import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_TIMERS } from "../config/timers";
import { useGameStore } from "../app/store/game.store";
import PageTransition from "../components/PageTransition";

export default function Support() {
  const nav = useNavigate();
  const { reset } = useGameStore();

  useEffect(() => {
    const id = setTimeout(() => {
      reset();
      nav("/select");
    }, DEFAULT_TIMERS.supportMs);
    return () => clearTimeout(id);
  }, [nav, reset]);

  return (
    <PageTransition>
      <main className="p-6 min-h-dvh grid place-items-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">ขอบคุณที่เล่นด้วย! 💖</h2>
          <p className="opacity-80">
            ช่วยกดไลค์ กดแชร์ สนับสนุนสตรีมนี้หน่อยนะ
          </p>
          <div className="flex gap-3 justify-center">
            <button className="px-4 py-2 rounded-xl shadow">กดไลค์ 👍</button>
            <button className="px-4 py-2 rounded-xl shadow">กดแชร์ 🔗</button>
          </div>
          <p className="opacity-60">กำลังพากลับไปหน้าเลือกเกม…</p>
        </div>
      </main>
    </PageTransition>
  );
}
