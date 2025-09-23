import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import PageTransition from "./components/PageTransition";
import SystemStatus from "./components/SystemStatus";
import { ws } from "./services/ws";
import { env } from "./env";

// ถ้ามี Toast/Modal กลางระบบ ค่อยเสียบเพิ่มตรงนี้
// import { Toaster } from "./components/Toast";

export default function App() {
  useEffect(() => {
    if (!env.VITE_WS_URL) return;
    ws.connect(env.VITE_WS_URL);
  }, []);

  return (
    <div className="min-h-dvh bg-white text-black">
      <Suspense fallback={<Fallback />}>
        <PageTransition>
          <SystemStatus />
          <RouterProvider router={router} />
        </PageTransition>
      </Suspense>
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
