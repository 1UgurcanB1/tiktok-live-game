import { create } from "zustand";
import type { DBStatusEvent, TikTokStatusEvent } from "@tiktok/types";
import { pushToast } from "../../components/Toast";

interface StatusState {
  dbOk: boolean;
  tkOk: boolean;
  tkUsername: string;
  setDB: (e: Pick<DBStatusEvent, "connected">) => void;
  setTikTok: (
    e: Pick<TikTokStatusEvent, "connected" | "username" | "roomId">,
  ) => void;
  reset: () => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  dbOk: false,
  tkOk: false,
  tkUsername: "Tiktok",
  setDB: (e) => set({ dbOk: !!e.connected }),
  setTikTok: (e) =>
    set({
      tkOk: !!e.connected && !!e.roomId,
      tkUsername: e.username ?? "Tiktok",
    }),
  reset: () =>
    set({
      dbOk: false,
      tkOk: false,
      tkUsername: "Tiktok",
    }),
}));

// Watch for status changes; if either service is NOT ok and we were previously fully ok,
// force navigate to home and show a toast.
// ทำ redirect กลับหน้าแรก & แสดง toast เมื่อ dbOk หรือ tkOk กลายเป็น false (ครั้งเดียวตอน transition)
if (typeof window !== "undefined") {
  let prevAllOk = true;
  useStatusStore.subscribe((state) => {
    const allOk = state.dbOk && state.tkOk;
    if (!allOk && prevAllOk) {
      const wasHome = window.location.pathname === "/";
      if (!wasHome) {
        // redirect first
        window.history.replaceState(null, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
        // show toast only if we actually navigated from another path
        pushToast("ระบบขาดการเชื่อมต่อ", "error");
      }
    }
    prevAllOk = allOk;
  });
}
