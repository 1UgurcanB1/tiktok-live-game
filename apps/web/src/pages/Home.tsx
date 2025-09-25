import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ButtonMotion from "../components/ButtonMotion";
import SystemStatus from "../components/SystemStatus";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../i18n";

export default function Home() {
  const nav = useNavigate();
  const { t, i18n } = useTranslation(["home", "common"]);
  return (
    <div className="h-full w-full">
      <div className="w-full flex items-center gap-6">
        <div className="flex-1" />
        <SystemStatus />
      </div>
      <PageTransition className="place-content-center justify-items-center gap-10">
        {/* Title */}
        <div className="text-center select-none px-6 font-extrabold">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight drop-shadow-md tracking-wider">
            {t("title.line1")}
          </h1>
          <p className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-wider">
            {t("title.line2")}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-5 w-full px-8">
          <ButtonMotion
            className="w-full max-w-[260px] rounded-full py-4 text-3xl font-bold bg-tangerine-pop text-midnight-indigo shadow-lg"
            onClick={() => nav("/select")}
          >
            {t("nav.start", { ns: "common" })}
          </ButtonMotion>

          <ButtonMotion
            className="w-full max-w-[260px] rounded-full py-4 text-3xl font-bold bg-solar-amber text-midnight-indigo shadow-lg"
            onClick={() => nav("/control")}
          >
            {t("nav.controlCenter", { ns: "common" })}
          </ButtonMotion>

          {/* Language Switch */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setLanguage("en")}
              className={[
                "px-4 py-1 rounded-full text-sm font-semibold border",
                i18n.language === "en"
                  ? "bg-white text-midnight-indigo border-white"
                  : "border-white/40 text-white/80 hover:text-white hover:border-white",
              ].join(" ")}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("th")}
              className={[
                "px-4 py-1 rounded-full text-sm font-semibold border",
                i18n.language === "th"
                  ? "bg-white text-midnight-indigo border-white"
                  : "border-white/40 text-white/80 hover:text-white hover:border-white",
              ].join(" ")}
            >
              TH
            </button>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
