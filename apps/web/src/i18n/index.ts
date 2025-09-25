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
import thCommon from "./resources/th/common.json";
import thHome from "./resources/th/home.json";
import thGameSelect from "./resources/th/gameSelect.json";
import thScoreboard from "./resources/th/scoreboard.json";
import thSupport from "./resources/th/support.json";
import thRoundSummary from "./resources/th/roundSummary.json";
import thRules from "./resources/th/rules.json";
import thPlay from "./resources/th/play.json";
import thToast from "./resources/th/toast.json";

// Determine initial language preference
let stored: string | null = null;
try {
  stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
} catch {
  stored = null;
}
const browser =
  typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "th";
// Default should now be Thai. Use stored preference if valid; otherwise always start in 'th'.
const initialLng = (() => {
  if (stored && ["en", "th"].includes(stored)) return stored;
  // If browser is Thai we use it, otherwise also Thai (forced default)
  return browser.startsWith("th") ? "th" : "th";
})();

export const AVAILABLE_LANGS = ["en", "th"] as const;

i18n.use(initReactI18next).init({
  lng: initialLng,
  fallbackLng: "en",
  supportedLngs: AVAILABLE_LANGS as unknown as string[],
  interpolation: { escapeValue: false },
  resources: {
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
    th: {
      common: thCommon,
      home: thHome,
      gameSelect: thGameSelect,
      scoreboard: thScoreboard,
      support: thSupport,
      roundSummary: thRoundSummary,
      rules: thRules,
      play: thPlay,
      toast: thToast,
    },
  },
});

// Helper to change language and persist
export function setLanguage(lng: string) {
  if (!AVAILABLE_LANGS.includes(lng as (typeof AVAILABLE_LANGS)[number])) {
    return;
  }
  i18n.changeLanguage(lng);
  try {
    localStorage.setItem("lang", lng);
  } catch {
    // ignore persistence errors (e.g., private mode)
  }
}

export default i18n;
