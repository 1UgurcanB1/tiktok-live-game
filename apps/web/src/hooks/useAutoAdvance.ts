import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAutoAdvance(
  enabled: boolean,
  nextPath: string,
  delayMs: number,
) {
  const nav = useNavigate();
  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => nav(nextPath), delayMs);
    return () => clearTimeout(t);
  }, [enabled, nextPath, delayMs, nav]);
}
