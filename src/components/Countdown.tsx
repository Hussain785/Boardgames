import { useEffect, useState } from "react";

interface CountdownProps {
  targetIso: string;
  label?: string;
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  reached: boolean;
}

function getTimeParts(targetIso: string): TimeParts {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = target - now;
  if (isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, reached: true };
  }
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, reached: true };
  }
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, reached: false };
}

/** Subscribes to a 1Hz tick. Used to keep the countdown live. */
function useNow(): number {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export default function Countdown({
  targetIso,
  label = "Until we're together",
}: CountdownProps) {
  // We deliberately don't store parts in state; they're derived from the
  // current time on every render. The hook below ensures we re-render
  // every second.
  useNow();
  const parts = getTimeParts(targetIso);

  if (parts.reached) {
    return (
      <div className="card text-center">
        <p className="label">{label}</p>
        <p className="font-display text-2xl sm:text-3xl gradient-text">
          The day is here. Go hold them tight.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="label text-center">{label}</p>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <Cell value={parts.days} unit="days" />
        <Cell value={parts.hours} unit="hours" />
        <Cell value={parts.minutes} unit="minutes" />
        <Cell value={parts.seconds} unit="seconds" />
      </div>
    </div>
  );
}

function Cell({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="rounded-2xl bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/5 py-3 sm:py-4 text-center">
      <div className="font-display text-3xl sm:text-4xl font-semibold gradient-text tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.18em] text-rose-500/80 dark:text-rose-200/70">
        {unit}
      </div>
    </div>
  );
}
