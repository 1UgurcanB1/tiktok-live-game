import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_TIMERS } from "@tiktok/constants";
import PageTransition from "../components/PageTransition";

export default function Scoreboard() {
  const nav = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => nav("/support"), DEFAULT_TIMERS.scoreboardMs);
    return () => clearTimeout(id);
  }, [nav]);

  const mock = [
    { name: "Player A", score: 120 },
    { name: "Player B", score: 90 },
    { name: "Player C", score: 70 },
  ];

  return (
    <PageTransition>
      <main className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">กระดานคะแนนรวมวันนี้</h2>
        <ol className="space-y-2">
          {mock.map((m, i) => (
            <li
              key={m.name}
              className="flex justify-between border rounded-xl p-3"
            >
              <span>
                #{i + 1} {m.name}
              </span>
              <span className="font-semibold">{m.score}</span>
            </li>
          ))}
        </ol>
        <p className="opacity-60 mt-4">จะไปหน้าซัพพอร์ตอัตโนมัติ…</p>
      </main>
    </PageTransition>
  );
}
