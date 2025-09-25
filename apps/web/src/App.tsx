import { Suspense, useEffect, useRef, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import PageTransition from "./components/PageTransition";
import { events, ws } from "./services/ws";
import { env } from "./env";
import { tiktokConnect } from "./services/api";
import SystemStatus from "./components/SystemStatus";

// ถ้ามี Toast/Modal กลางระบบ ค่อยเสียบเพิ่มตรงนี้
// import { Toaster } from "./components/Toast";

export default function App() {
  const [booted, setBooted] = useState(false);
  const abortedRef = useRef(false);

  useEffect(() => {
    const ac = new AbortController();
    abortedRef.current = false;

    // 1) Connect WS immediately if configured (non-blocking)
    if (env.VITE_WS_URL) {
      ws.connect(env.VITE_WS_URL);
    }

    // 2) Try TikTok connect; wait for it to settle before rendering
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
      } finally {
        if (!abortedRef.current) setBooted(true);
      }
    };

    // 2.1) Log all TikTok events for debugging
    const offLog = events.on("tiktok.*", (ev: unknown) => {
      try {
        const obj = ev as { type?: string };
        console.warn("[tiktok]", obj?.type ?? "event", ev);
      } catch {
        // no-op
      }
    });

    init().catch(console.error);

    return () => {
      abortedRef.current = true;
      ac.abort();
      offLog();
    };
  }, []);

  return (
    <div className="min-h-dvh bg-neutral-900  text-white font-kanit">
      {!booted ? (
        <Fallback />
      ) : (
        <Suspense fallback={<Fallback />}>
          <PageTransition>
            <div className="min-h-dvh w-full grid place-items-center p-4">
              <div className="relative grid w-[min(92vw,500px)] aspect-[9/16] bg-midnight-indigo text-arctic-sky rounded-3xl shadow-2xl overflow-hidden min-h-0 min-w-0 p-6">
                <SystemStatus />
                <RouterProvider router={router} />
              </div>
            </div>
          </PageTransition>
        </Suspense>
      )}
      {/* <Toaster /> */}
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
