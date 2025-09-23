import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GAMES } from "../config/games.config";
import { DEFAULT_TIMERS } from "../config/timers";
import { useGameStore } from "../app/store/game.store";
import PageTransition from "../components/PageTransition";

export default function GameSelect() {
  const nav = useNavigate();
  const { setGame } = useGameStore();
  const deadline = useMemo(() => Date.now() + DEFAULT_TIMERS.selectGameMs, []);
  const left = Math.max(0, deadline - Date.now());

  useEffect(() => {
    const id = window.setTimeout(() => {
      // หมดเวลา → auto เลือกเกมแรก
      if (GAMES[0]) {
        setGame(GAMES[0]);
        nav("/rules");
      }
    }, left);
    return () => clearTimeout(id);
  }, [left, nav, setGame]);

  return (
    <PageTransition>
      <main className="p-6 max-w-4xl mx-auto">
        <header className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold">
            เลือกเกม (เหลือ {Math.ceil(left / 1000)}s)
          </h2>
        </header>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMES.map((g) => (
            <li
              key={g.id}
              className="rounded-2xl border p-4 hover:shadow transition"
            >
              <h3 className="text-lg font-semibold">{g.name}</h3>
              <p className="text-sm opacity-70 mb-3">{g.description}</p>
              <button
                className="px-3 py-2 rounded-xl shadow"
                onClick={() => {
                  setGame(g);
                  nav("/rules");
                }}
              >
                เลือกเกมนี้
              </button>
            </li>
          ))}
        </ul>
      </main>
    </PageTransition>
  );
}
