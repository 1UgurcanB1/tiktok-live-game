import { Suspense, useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import PageTransition from "./components/PageTransition";
import { events, ws } from "./services/ws";
import { env } from "./env";
import { getDBStatus, getTiktokStatus, tiktokConnect } from "./services/api";
import { useStatusStore } from "./app/store/status.store";
import type { DBStatusEvent, TikTokStatusEvent } from "@tiktok/types";

// ถ้ามี Toast/Modal กลางระบบ ค่อยเสียบเพิ่มตรงนี้
import { Toaster } from "./components/Toast";

export default function App() {
  const abortedRef = useRef(false);
  const { setDB, setTikTok } = useStatusStore();

  useEffect(() => {
    const ac = new AbortController();
    abortedRef.current = false;

    // 1) Connect WS immediately if configured (non-blocking)
    if (env.VITE_WS_URL) {
      ws.connect(env.VITE_WS_URL);
    }

    // 2) Fetch initial statuses in parallel (non-blocking for WS connect)
    const fetchStatuses = async () => {
      try {
        const [dbRes, tkRes] = await Promise.allSettled([
          getDBStatus({ signal: ac.signal }),
          getTiktokStatus({ signal: ac.signal }),
        ]);
        if (dbRes.status === "fulfilled") {
          setDB({ connected: dbRes.value.connected });
        } else setDB({ connected: false });
        if (tkRes.status === "fulfilled") {
          setTikTok({
            connected: tkRes.value.connected,
            username: tkRes.value.username,
            roomId: tkRes.value.roomId,
          });
        } else {
          setTikTok({
            connected: false,
            username: undefined,
            roomId: undefined,
          });
        }
      } catch {
        setDB({ connected: false });
        setTikTok({ connected: false, username: undefined, roomId: undefined });
      }
    };

    // 3) Try TikTok connect; mark boot completed afterwards
    const init = async () => {
      try {
        const username = env.VITE_TIKTOK_USERNAME?.trim();
        if (username) {
          const res = await tiktokConnect(username, {
            signal: ac.signal,
            mode: env.VITE_TIKTOK_MODE,
          });
          console.warn("Tiktok Connected successfully:", res);
        } else {
          console.warn("Skip TikTok connect: VITE_TIKTOK_USERNAME is empty");
        }
      } catch (e) {
        console.warn("Unable to connect TikTok:", e);
      }
    };

    fetchStatuses().catch(console.error);
    init().catch(console.error);

    // Listen for status events & update store
    const offDb = events.on("db.status", (ev: DBStatusEvent) => {
      setDB({ connected: ev.connected });
    });
    const offTk = events.on("tiktok.status", (ev: TikTokStatusEvent) => {
      setTikTok({
        connected: ev.connected,
        username: ev.username,
        roomId: ev.roomId,
      });
    });

    return () => {
      abortedRef.current = true;
      ac.abort();
      offDb();
      offTk();
    };
  }, [setDB, setTikTok]);

  return (
    <div className="min-h-dvh bg-neutral-900  text-white font-kanit">
      <Suspense fallback={<Fallback />}>
        <PageTransition>
          <div className="min-h-dvh w-full grid place-items-center p-4">
            <div className="relative grid w-[min(92vw,500px)] aspect-[9/16] bg-midnight-indigo text-arctic-sky rounded-3xl shadow-2xl overflow-hidden min-h-0 min-w-0 p-6">
              <RouterProvider router={router} />
            </div>
          </div>
        </PageTransition>
      </Suspense>
      <Toaster />
    </div>
  );
}

function Fallback() {
  return (
    <div className="grid place-items-center h-dvh">
      <div className="animate-pulse text-center">
        <div className="h-3 w-28 rounded bg-black/20 mx-auto mb-3" />
        <p className="opacity-60">กำลังโหลด…</p>
      </div>
    </div>
  );
}
