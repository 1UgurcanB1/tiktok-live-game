import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_TIMERS } from "@tiktok/constants";
import { useGameStore } from "../app/store/game.store";
import PageTransition from "../components/PageTransition";
import { useTranslation } from "react-i18next";

export default function Support() {
  const nav = useNavigate();
  const { t } = useTranslation(["support"]);
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
          <h2 className="text-2xl font-bold">{t("thanks")}</h2>
          <p className="opacity-80">{t("cta")}</p>
          <div className="flex gap-3 justify-center">
            <button className="px-4 py-2 rounded-xl shadow">{t("like")}</button>
            <button className="px-4 py-2 rounded-xl shadow">
              {t("share")}
            </button>
          </div>
          <p className="opacity-60">{t("autoBack")}</p>
        </div>
      </main>
    </PageTransition>
  );
}
