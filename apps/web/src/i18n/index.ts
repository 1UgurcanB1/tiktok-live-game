import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "./resources/en/common.json";
import enHome from "./resources/en/home.json";
import enGameSelect from "./resources/en/gameSelect.json";
import enScoreboard from "./resources/en/scoreboard.json";
import enSupport from "./resources/en/support.json";
import enRoundSummary from "./resources/en/roundSummary.json";
import enRules from "./resources/en/rules.json";
import enPlay from "./resources/en/play.json";
import enToast from "./resources/en/toast.json";
import trCommon from "./resources/tr/common.json";
import trHome from "./resources/tr/home.json";
import trGameSelect from "./resources/tr/gameSelect.json";
import trScoreboard from "./resources/tr/scoreboard.json";
import trSupport from "./resources/tr/support.json";
import trRoundSummary from "./resources/tr/roundSummary.json";
import trRules from "./resources/tr/rules.json";
import trPlay from "./resources/tr/play.json";
import trToast from "./resources/tr/toast.json";

let stored: string | null = null;
try {
  stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
} catch {
  stored = null;
}

const initialLng = stored && ["en", "tr"].includes(stored) ? stored : "tr";

export const AVAILABLE_LANGS = ["tr", "en"] as const;

i18n.use(initReactI18next).init({
  lng: initialLng,
  fallbackLng: "tr",
  supportedLngs: AVAILABLE_LANGS as unknown as string[],
  interpolation: { escapeValue: false },
  resources: {
    tr: {
      common: trCommon,
      home: trHome,
      gameSelect: trGameSelect,
      scoreboard: trScoreboard,
      support: trSupport,
      roundSummary: trRoundSummary,
      rules: trRules,
      play: trPlay,
      toast: trToast,
    },
    en: {
      common: enCommon,
      home: enHome,
      gameSelect: enGameSelect,
      scoreboard: enScoreboard,
      support: enSupport,
      roundSummary: enRoundSummary,
      rules: enRules,
      play: enPlay,
      toast: enToast,
    },
  },
});

export function setLanguage(lng: string) {
  if (!AVAILABLE_LANGS.includes(lng as (typeof AVAILABLE_LANGS)[number])) return;
  i18n.changeLanguage(lng);
  try {
    localStorage.setItem("lang", lng);
  } catch {
    // ignore persistence errors
  }
}

export default i18n;
