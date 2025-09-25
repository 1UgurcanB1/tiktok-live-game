import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_TIMERS } from "@tiktok/constants";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../app/store/game.store";
import PageTransition from "../components/PageTransition";
import TimedProgressBar from "../components/TimedProgressBar";
import SystemStatus from "../components/SystemStatus";
import { localized } from "../lib/localize";

export default function Rules() {
  const navigate = useNavigate();
  const selected = useGameStore((s) => s.selected);
  const { t, i18n } = useTranslation(["rules", "common"]);

  // Fallback: if user refreshed and lost selection, send back to select page
  useEffect(() => {
    if (!selected) {
      const timeout = setTimeout(() => navigate("/select"), 2000);
      return () => clearTimeout(timeout);
    }
  }, [selected, navigate]);

  const localeGameName = useMemo(() => {
    if (!selected) return t("notSelected");
    return localized(selected, "name");
  }, [selected, i18n.language, t]);

  const localizedRules: string[] = useMemo(() => {
    if (!selected) return [];
    return localized(selected, "rules");
  }, [selected, i18n.language]);

  const gameImage = selected?.gameImage;
  const gameDescription = useMemo(() => {
    if (!selected) return "";
    return localized(selected, "description");
  }, [selected, i18n.language]);

  const onComplete = () => {
    navigate("/play");
  };

  const totalMs = selected?.timersOverride?.rulesMs || DEFAULT_TIMERS.rulesMs;

  return (
    <div className="h-full w-full">
      <div className="w-full flex items-center gap-6">
        <TimedProgressBar
          duration={selected ? totalMs : undefined}
          onComplete={selected ? onComplete : undefined}
          className="flex-1"
          trackClassName="bg-white/20"
          barClassName="bg-tangerine-pop"
        />
        <SystemStatus />
      </div>
      <PageTransition className="gap-5 py-6">
        <div className="flex flex-col">
          {/* Header */}
          <h2 className="text-3xl text-white text-center font-extrabold">
            {t("title", { game: localeGameName })}
          </h2>
          {!selected && (
            <p className="text-center text-red-300 mt-2">
              {t("notSelected")} – {t("backToSelect", { ns: "rules" })}
            </p>
          )}
          {selected && (
            <h4 className="text-xl text-arctic-sky text-center">
              {localeGameName}
            </h4>
          )}
          <hr className="mt-6" />
          {selected && (
            <>
              {/* Illustration */}
              {gameImage && (
                <div className="rounded-2xl overflow-hidden bg-white/5 mt-6">
                  <div className="aspect-[6/4] w-full">
                    <img
                      src={gameImage}
                      alt={localeGameName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              {gameDescription && (
                <p className="text-[#cfe6ff] text-lg leading-relaxed pt-6">
                  {gameDescription}
                </p>
              )}

              {/* Rules List */}
              <ul className="list-decimal list-inside text-[#e3f2ff] text-lg mt-4 space-y-2">
                {localizedRules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>

              {/* Meta Info */}
              <div className="mt-6 text-white/60 flex flex-wrap gap-x-4 gap-y-1">
                <span className="w-full text-right">
                  {t("list.totalRounds", {
                    count: selected.defaultRounds,
                    ns: "rules",
                  })}
                </span>
              </div>
            </>
          )}
        </div>
      </PageTransition>
    </div>
  );
}
