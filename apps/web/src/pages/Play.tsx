import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../app/store/game.store";
import { useTranslation } from "react-i18next";
import PageTransition from "../components/PageTransition";

export default function Play() {
  const nav = useNavigate();
  const { selected, currentRound, totalRounds } = useGameStore();
  const { i18n, t } = useTranslation(["play"]);
  const roundMs = useMemo(
    () => selected?.defaultRoundDurationMs ?? 30_000,
    [selected],
  );
  const [left, setLeft] = useState(roundMs);

  // Localized name (must be before any conditional returns; no hooks after a return)
  const localName = useMemo(() => {
    if (!selected) return "";
    if (i18n.language.startsWith("en") && selected.nameEn) {
      return selected.nameEn;
    }
    return selected.name;
  }, [i18n.language, selected]);

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

  if (!selected) return <div className="p-6">{t("notSelected")}</div>;

  return (
    <PageTransition>
      <main className="p-6 max-w-3xl mx-auto">
        <header className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-bold">{localName}</h2>
          <span className="opacity-70">
            {t("roundProgress", { current: currentRound, total: totalRounds })}
          </span>
        </header>

        <section className="rounded-2xl border p-6 space-y-4">
          <p className="text-lg">{t("questionPlaceholder")}</p>
          <div className="h-2 w-full bg-black/10 rounded">
            <div
              className="h-2 bg-black/60 rounded"
              style={{ width: `${((roundMs - left) / roundMs) * 100}%` }}
            />
          </div>
          <p className="opacity-70">
            {t("timeLeft", { seconds: Math.ceil(left / 1000) })}
          </p>
          <button
            className="px-3 py-2 rounded-xl shadow"
            onClick={() => nav("/summary")}
          >
            {t("endRoundTest")}
          </button>
        </section>
      </main>
    </PageTransition>
  );
}
