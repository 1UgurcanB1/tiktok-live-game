import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ButtonMotion from "../components/ButtonMotion";
import SystemStatus from "../components/SystemStatus";

export default function Home() {
  const nav = useNavigate();
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
            TIKTOK
          </h1>
          <p className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-wider">
            LIVE GAME
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-5 w-full px-8">
          <ButtonMotion
            className="w-full max-w-[260px] rounded-full py-4 text-3xl font-bold bg-tangerine-pop text-midnight-indigo shadow-lg"
            onClick={() => nav("/select")}
          >
            เริ่มเกม
          </ButtonMotion>

          <ButtonMotion
            className="w-full max-w-[260px] rounded-full py-4 text-3xl font-bold bg-solar-amber text-midnight-indigo shadow-lg"
            onClick={() => nav("/control")}
          >
            ศูนย์ควบคุม
          </ButtonMotion>
        </div>
      </PageTransition>
    </div>
  );
}
