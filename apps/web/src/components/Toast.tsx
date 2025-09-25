import { useEffect, useState } from "react";

// Simple toast system using a DOM CustomEvent so it can be triggered anywhere (even outside React modules)
// Dispatch new CustomEvent('app:toast', { detail: { id, message, type } })

export type ToastType = "info" | "success" | "error" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  ttl: number; // milliseconds
}

const DEFAULT_TTL = 4000;

// Public helper to fire a toast from non-React code (e.g., Zustand store subscribe)
export function pushToast(
  message: string,
  type: ToastType = "error",
  ttl = DEFAULT_TTL,
) {
  if (typeof window === "undefined") return;
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  window.dispatchEvent(
    new CustomEvent<ToastItem>("app:toast", {
      detail: { id, message, type, ttl },
    }),
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<ToastItem>).detail;
      if (!detail) return;
      setToasts((prev) => [...prev, detail]);
      // schedule removal
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== detail.id));
      }, detail.ttl);
    };
    window.addEventListener("app:toast", onToast as EventListener);
    return () =>
      window.removeEventListener("app:toast", onToast as EventListener);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-[999] flex flex-col items-center gap-2 px-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            "pointer-events-auto w-full max-w-sm rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur transition-all duration-300 " +
            toastColorClasses(t.type)
          }
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

function toastColorClasses(type: ToastType): string {
  switch (type) {
    case "success":
      return "bg-emerald-600/90 border-emerald-400 text-white";
    case "error":
      return "bg-rose-600/90 border-rose-400 text-white";
    case "warning":
      return "bg-amber-500/90 border-amber-300 text-black";
    case "info":
    default:
      return "bg-sky-600/90 border-sky-400 text-white";
  }
}
