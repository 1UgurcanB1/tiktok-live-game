import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_TIMERS } from "@tiktok/constants";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../app/store/game.store";
import PageTransition from "../components/PageTransition";

export default function Rules() {
  const nav = useNavigate();
  const { selected } = useGameStore();
  const { i18n, t } = useTranslation(["rules"]);
  const ms = useMemo(
    () => selected?.timersOverride?.rulesMs ?? DEFAULT_TIMERS.rulesMs,
    [selected],
  );

  const localName = useMemo(() => {
    if (!selected) return "";
    if (i18n.language.startsWith("en") && selected.nameEn) {
      return selected.nameEn;
    }
    return selected.name; // Thai default
  }, [i18n.language, selected]);

  useEffect(() => {
    if (!selected) return;
    const id = window.setTimeout(() => nav("/play"), ms);
    return () => clearTimeout(id);
  }, [ms, nav, selected]);

  if (!selected) {
    return (
      <main className="p-6">
        <p>
          {t("notSelected")} →{" "}
          <button className="underline" onClick={() => nav("/select")}>
            {t("backToSelect")}
          </button>
        </p>
      </main>
    );
  }

  return (
    <PageTransition>
      <main className="p-6 max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">
          {t("title", { game: localName })}
        </h2>
        <ol className="list-decimal pl-6 space-y-2 opacity-80">
          <li>{t("list.totalRounds", { count: selected.defaultRounds })}</li>
          <li>{t("list.chatFast")}</li>
          <li>{t("list.summary")}</li>
        </ol>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-xl shadow"
            onClick={() => nav("/play")}
          >
            {t("startNow")}
          </button>
          <p className="opacity-60 self-center">
            {t("autoNext", { seconds: Math.ceil(ms / 1000) })}
          </p>
        </div>
      </main>
    </PageTransition>
  );
}
