import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function Home() {
  const nav = useNavigate();
  return (
    <PageTransition>
      <main className="min-h-dvh grid place-items-center p-8">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-3xl font-bold">TikTok Live Game</h1>
          <p className="opacity-70">เล่นเกมกับผู้ชมแบบสด ๆ</p>
          <div className="flex gap-3 justify-center">
            <button
              className="px-4 py-2 rounded-2xl shadow"
              onClick={() => nav("/select")}
            >
              เริ่มเกม
            </button>
            <button
              className="px-4 py-2 rounded-2xl shadow"
              onClick={() => nav("/control")}
            >
              เข้าหน้าควบคุม
            </button>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
