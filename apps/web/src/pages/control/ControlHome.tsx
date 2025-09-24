import { useNavigate } from "react-router-dom";

export default function ControlHome() {
  const nav = useNavigate();
  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Control Panel</h2>
      <p className="opacity-70">
        หน้านี้ไว้ควบคุม Session/เกม เชื่อม DB/WS (จะเติมทีหลัง)
      </p>
      <div className="flex gap-3">
        <button
          className="px-4 py-2 rounded-xl shadow"
          onClick={() => nav("/select")}
        >
          ไปหน้าเล่น
        </button>
      </div>
    </main>
  );
}
