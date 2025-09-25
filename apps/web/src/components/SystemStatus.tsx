import { useStatusStore } from "../app/store/status.store";

// Passive system status pill; all realtime logic lives in App.tsx via the status store
export default function MinimalStatus() {
  const dbOk = useStatusStore((s) => s.dbOk);
  const tkOk = useStatusStore((s) => s.tkOk);
  const tkUsername = useStatusStore((s) => s.tkUsername);
  return (
    <div className="z-50 text-xs bg-white/80 text-midnight-indigo backdrop-blur rounded-full px-2 py-1.5 shadow-sm">
      <span className="inline-flex items-center gap-1 mr-2">
        <Dot ok={dbOk} /> DB
      </span>
      <span className="inline-flex items-center gap-1">
        <Dot ok={tkOk} /> {tkUsername}
      </span>
    </div>
  );
}

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${
        ok ? "bg-emerald-500" : "bg-rose-500"
      }`}
      aria-label={ok ? "online" : "offline"}
      title={ok ? "online" : "offline"}
    />
  );
}
