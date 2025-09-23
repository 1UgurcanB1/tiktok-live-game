import { useEffect, useRef, useState } from "react";

export function useCountdown(ms: number, onComplete?: () => void) {
  const [left, setLeft] = useState(ms);
  const timer = useRef<number | null>(null); // ใช้ number เพราะ window.setInterval คืน number

  useEffect(() => {
    const start = performance.now();
    timer.current = window.setInterval(() => {
      const diff = performance.now() - start;
      const remain = Math.max(ms - diff, 0);
      setLeft(remain);
      if (remain === 0 && timer.current !== null) {
        window.clearInterval(timer.current);
        timer.current = null;
        onComplete?.();
      }
    }, 100);

    // ✅ cleanup คืนค่าเป็น void เสมอ
    return () => {
      if (timer.current !== null) {
        window.clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [ms, onComplete]);

  return Math.ceil(left / 1000);
}
