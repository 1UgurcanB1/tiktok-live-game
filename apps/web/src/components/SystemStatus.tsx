import { useEffect, useState, useCallback } from "react";
import { useBroadcast } from "../hooks/useBroadcast";
import type { DBStatusEvent, TikTokStatusEvent } from "@tiktok/types";
import { getDBStatus, getTiktokStatus } from "../services/api";

export default function MinimalStatus() {
  const [dbOk, setDbOk] = useState(false);
  const [tkOk, setTkOk] = useState(false);
  const [tkUsername, setTkUsername] = useState("Tiktok");

  // ครั้งแรกดึงจาก API
  useEffect(() => {
    const ac = new AbortController();
    getDBStatus({ signal: ac.signal })
      .then((h) => {
        setDbOk(!!h.connected);
      })
      .catch(() => {
        setDbOk(false);
      });
    return () => ac.abort();
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    getTiktokStatus({ signal: ac.signal })
      .then((h) => {
        if (h.roomId) {
          setTkOk(!!h.connected);
          setTkUsername(h.username ?? "Tiktok");
        } else {
          setTkOk(false);
          setTkUsername("Tiktok");
        }
      })
      .catch(() => {
        setTkOk(false);
        setTkUsername("Tiktok");
      });
    return () => ac.abort();
  }, []);

  // อัปเดตแบบ realtime จาก WS
  const onDBStatus = useCallback((e: DBStatusEvent) => {
    setDbOk(!!e.connected);
  }, []);
  useBroadcast<DBStatusEvent>("db.status", onDBStatus);

  const onTiktokStatus = useCallback((e: TikTokStatusEvent) => {
    if (e.roomId) {
      setTkOk(!!e.connected);
      setTkUsername(e.username ?? "Tiktok");
    } else {
      setTkOk(false);
      setTkUsername("Tiktok");
    }
  }, []);
  useBroadcast<TikTokStatusEvent>("tiktok.status", onTiktokStatus);

  return (
    <div className="absolute top-3 right-3 z-50 text-xs bg-white/80 text-midnight-indigo backdrop-blur rounded-full px-2 py-1.5 shadow-sm">
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
