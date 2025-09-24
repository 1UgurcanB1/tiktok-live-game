import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type ProgressBarHandle = {
  /** Set progress 0–100 (controlled manually) */
  set: (percent: number) => void;
  /** Reset to 0 and stop */
  reset: () => void;
  /** Start timed mode from current value */
  start: () => void;
  pause: () => void;
  resume: () => void;
};

export type ProgressBarProps = {
  /** Duration in milliseconds for 0 → 100% when in timed mode */
  duration?: number; // if omitted, acts as a controlled bar (use .set)
  autoplay?: boolean; // default true when duration provided
  paused?: boolean; // external pause control (optional)
  onComplete?: () => void;
  className?: string; // wrapper classes
  trackClassName?: string; // background track
  barClassName?: string; // foreground bar
  /** initial percentage (0–100) */
  initial?: number;
};

/**
 * Timed/Controlled Progress Bar
 * - If `duration` is provided, it animates from current value → 100% in that duration (autoplay by default)
 * - Exposes imperative controls via ref
 */
const TimedProgressBar = forwardRef<ProgressBarHandle, ProgressBarProps>(
  (
    {
      duration,
      autoplay = true,
      paused,
      onComplete,
      className = "w-full",
      trackClassName = "bg-white/20",
      barClassName = "bg-[#ffa654]",
      initial = 0,
    },
    ref,
  ) => {
    const [value, setValue] = useState<number>(
      Math.min(Math.max(initial, 0), 100),
    );
    const rafRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const carriedRef = useRef<number>(0); // ms accumulated when paused/resumed
    const runningRef = useRef<boolean>(false);

    const tick = useCallback(
      (t: number) => {
        if (!runningRef.current || duration == null) return;
        if (startTimeRef.current == null) startTimeRef.current = t;
        const elapsed = t - startTimeRef.current + carriedRef.current;
        const pct = Math.min(100, (elapsed / duration) * 100);
        setValue(pct);
        if (pct >= 100) {
          runningRef.current = false;
          startTimeRef.current = null;
          carriedRef.current = 0;
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          onComplete?.();
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      },
      [duration, onComplete],
    );

    const start = useCallback(() => {
      if (duration == null) return; // controlled mode
      if (value >= 100) return; // already complete
      runningRef.current = true;
      startTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    }, [duration, tick, value]);

    const pause = useCallback(() => {
      if (!runningRef.current) return;
      runningRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // accumulate elapsed so far
      if (startTimeRef.current != null) {
        carriedRef.current += performance.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
    }, []);

    const resume = useCallback(() => {
      if (duration == null || value >= 100) return;
      if (runningRef.current) return;
      runningRef.current = true;
      startTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    }, [duration, tick, value]);

    const reset = useCallback(() => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startTimeRef.current = null;
      carriedRef.current = 0;
      setValue(0);
    }, []);

    const set = useCallback((percent: number) => {
      const v = Math.min(100, Math.max(0, percent));
      setValue(v);
    }, []);

    // expose controls
    useImperativeHandle(ref, () => ({ set, reset, start, pause, resume }), [
      set,
      reset,
      start,
      pause,
      resume,
    ]);

    // autoplay when duration provided
    useEffect(() => {
      if (duration == null) return; // controlled mode
      if (autoplay) start();
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally omit 'start' to avoid restarting timer if function identity changes
    }, [duration, autoplay]);

    // respond to external paused prop
    useEffect(() => {
      if (paused == null) return;
      if (paused) pause();
      else resume();
    }, [paused, pause, resume]);

    return (
      <div className={`h-2 rounded-full overflow-hidden ${className}`}>
        <div
          className={`h-full transition-[width] duration-150 ease-linear ${trackClassName}`}
        >
          <div
            className={`h-full rounded-full ${barClassName}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  },
);

export default TimedProgressBar;
