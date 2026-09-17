import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../app/store/game.store";
import PageTransition from "../components/PageTransition";
import { events } from "../services/ws";
import { QUIZ_ITEMS, VERSUS_ITEMS } from "../data/liveContent";

function percentage(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

export default function Play() {
  const nav = useNavigate();
  const { selected, currentRound, totalRounds } = useGameStore();
  const roundMs = selected?.defaultRoundDurationMs ?? 30_000;
  const [left, setLeft] = useState(roundMs);
  const [quizVotes, setQuizVotes] = useState([0, 0, 0]);
  const [versusVotes, setVersusVotes] = useState([0, 0]);

  const quiz = useMemo(
    () => QUIZ_ITEMS[(Math.max(currentRound, 1) - 1) % QUIZ_ITEMS.length],
    [currentRound],
  );
  const versus = useMemo(
    () => VERSUS_ITEMS[(Math.max(currentRound, 1) - 1) % VERSUS_ITEMS.length],
    [currentRound],
  );

  useEffect(() => {
    setLeft(roundMs);
    setQuizVotes([0, 0, 0]);
    setVersusVotes([0, 0]);

    const start = performance.now();
    const timer = window.setInterval(() => {
      const remain = Math.max(roundMs - (performance.now() - start), 0);
      setLeft(remain);
      if (remain === 0) {
        window.clearInterval(timer);
        nav("/summary");
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [currentRound, nav, roundMs, selected?.id]);

  useEffect(() => {
    const off = events.on("tiktok.chat", (ev: unknown) => {
      const msg = ev as { data?: { comment?: string } };
      const text = (msg?.data?.comment ?? "").trim().toUpperCase();
      if (!selected) return;

      if (selected.id === "gsQuiz" || selected.id === "historyQuiz") {
        const match = text.match(/^[123]$/);
        if (!match) return;
        const index = Number(match[0]) - 1;
        setQuizVotes((current) => {
          const next = [...current];
          next[index] += 1;
          return next;
        });
      }

      if (selected.id === "playerVs" || selected.id === "higherLower") {
        if (text !== "A" && text !== "B") return;
        const index = text === "A" ? 0 : 1;
        setVersusVotes((current) => {
          const next = [...current];
          next[index] += 1;
          return next;
        });
      }
    });
    return () => off();
  }, [selected]);

  if (!selected) {
    return <div className="p-6 text-white">Oyun seçilmedi.</div>;
  }

  const progress = ((roundMs - left) / roundMs) * 100;
  const seconds = Math.ceil(left / 1000);
  const quizTotal = quizVotes.reduce((a, b) => a + b, 0);
  const versusTotal = versusVotes[0] + versusVotes[1];
  const isQuiz = selected.id === "gsQuiz" || selected.id === "historyQuiz";
  const isVersus = selected.id === "playerVs" || selected.id === "higherLower";

  return (
    <PageTransition>
      <main className="min-h-screen w-full max-w-3xl mx-auto p-6 text-white flex flex-col gap-6">
        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-yellow-300">Galatasaray Taraftar Arena</p>
            <h1 className="text-3xl font-black">{selected.name}</h1>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black tabular-nums">{seconds}</div>
            <div className="text-sm opacity-70">Tur {currentRound}/{totalRounds}</div>
          </div>
        </header>

        <div className="h-3 overflow-hidden rounded-full bg-white/15">
          <div className="h-full bg-yellow-400 transition-[width] duration-100" style={{ width: `${progress}%` }} />
        </div>

        {isQuiz && quiz && (
          <section className="rounded-3xl border border-white/15 bg-black/35 p-6 space-y-5">
            <p className="text-sm font-bold text-yellow-300">YORUMA 1 / 2 / 3 YAZ</p>
            <h2 className="text-3xl font-extrabold leading-tight">{quiz.question}</h2>
            <div className="grid gap-3">
              {quiz.options.map((option, index) => {
                const votes = quizVotes[index] ?? 0;
                const pct = percentage(votes, quizTotal);
                return (
                  <div key={option} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="absolute inset-y-0 left-0 bg-white/10" style={{ width: `${pct}%` }} />
                    <div className="relative flex items-center justify-between gap-4">
                      <span className="text-xl font-bold"><b className="mr-3 text-yellow-300">{index + 1}</b>{option}</span>
                      <span className="font-black tabular-nums">{votes} oy · %{pct}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-white/60">Toplam {quizTotal} oy</p>
          </section>
        )}

        {isVersus && versus && (
          <section className="rounded-3xl border border-white/15 bg-black/35 p-6 space-y-6">
            <div className="text-center">
              <p className="text-sm font-bold text-yellow-300">YORUMA A VEYA B YAZ</p>
              <h2 className="text-2xl font-extrabold">{versus.prompt}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "A", name: versus.left, votes: versusVotes[0] },
                { key: "B", name: versus.right, votes: versusVotes[1] },
              ].map((item) => {
                const pct = percentage(item.votes, versusTotal);
                return (
                  <div key={item.key} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                    <div className="text-5xl font-black text-yellow-300">{item.key}</div>
                    <div className="mt-4 text-3xl font-black">{item.name}</div>
                    <div className="mt-5 text-xl font-bold">{item.votes} oy</div>
                    <div className="mt-2 text-4xl font-black">%{pct}</div>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-white/60">Toplam {versusTotal} oy</p>
          </section>
        )}

        {!isQuiz && !isVersus && (
          <section className="rounded-3xl border border-white/15 bg-black/35 p-8 text-center space-y-4">
            <p className="text-yellow-300 font-bold">MODÜL HAZIRLANIYOR</p>
            <h2 className="text-3xl font-black">{selected.name}</h2>
            <p className="text-white/70">Bu modül katalogda aktif. Oyun mekaniği sonraki geliştirme adımında bağlanacak.</p>
          </section>
        )}
      </main>
    </PageTransition>
  );
}
