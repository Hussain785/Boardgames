import { motion } from "framer-motion";
import { Heart, Music } from "lucide-react";
import {
  ACCENTS,
  type AccentKey,
  type LetterData,
  daysBetween,
} from "../lib/letter";
import Countdown from "./Countdown";

interface LetterPaperProps {
  data: LetterData;
  preview?: boolean;
}

export default function LetterPaper({ data, preview = false }: LetterPaperProps) {
  const accent = ACCENTS[(data.accent || "rose") as AccentKey];
  const daysTogether = daysBetween(data.sinceDate);
  const lines = (data.body || "").split(/\n+/).filter(Boolean);
  const reasons = (data.reasons || []).filter((r) => r.trim().length > 0);

  return (
    <article
      className="paper relative mx-auto w-full max-w-2xl px-6 sm:px-10 py-10 sm:py-14"
      style={{
        ["--accent-from" as never]: accent.from,
        ["--accent-to" as never]: accent.to,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute -top-3 left-6 sm:left-10 right-6 sm:right-10 h-2 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
          opacity: 0.7,
        }}
      />

      <header className="text-center">
        {data.from && (
          <p className="text-xs uppercase tracking-[0.3em] text-rose-500/80 dark:text-rose-200/70">
            From {data.from}
          </p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: preview ? 0 : 0.15 }}
          className="font-script text-5xl sm:text-6xl mt-2"
          style={{
            background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {data.title || "My dearest"}
          {data.to ? `, ${data.to}` : ""}
        </motion.h1>
      </header>

      <section className="mt-8 space-y-5 font-display text-[17px] sm:text-lg leading-[1.8] text-rose-900/90 dark:text-rose-50/90 text-pretty">
        {lines.length > 0 ? (
          lines.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: preview ? 0 : 0.25 + i * 0.08 }}
            >
              {p}
            </motion.p>
          ))
        ) : (
          <p className="italic opacity-60">
            (Your letter will appear here as you write it.)
          </p>
        )}
      </section>

      {reasons.length > 0 && (
        <section className="mt-10">
          <h2 className="label text-center">Reasons I love you</h2>
          <ul className="mt-3 grid sm:grid-cols-2 gap-3">
            {reasons.map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: preview ? 0 : 0.6 + i * 0.05 }}
                className="flex items-start gap-2 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/5 px-4 py-3 text-sm sm:text-base"
              >
                <span
                  className="mt-1 inline-grid place-items-center w-5 h-5 shrink-0 rounded-full text-white"
                  style={{
                    background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                  }}
                >
                  <Heart
                    className="w-3 h-3"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </span>
                <span>{r}</span>
              </motion.li>
            ))}
          </ul>
        </section>
      )}

      {(data.reunionDate || daysTogether !== null) && (
        <section className="mt-10 grid sm:grid-cols-2 gap-4">
          {data.reunionDate && (
            <Countdown
              targetIso={data.reunionDate}
              label="Until we're together"
            />
          )}
          {daysTogether !== null && (
            <div className="card text-center">
              <p className="label">Days of us</p>
              <p className="font-display text-4xl sm:text-5xl gradient-text tabular-nums">
                {Math.max(daysTogether, 0).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-rose-500/80 dark:text-rose-200/70">
                and counting, my favorite story
              </p>
            </div>
          )}
        </section>
      )}

      {data.songUrl && (
        <section className="mt-10">
          <p className="label">Our song</p>
          <a
            href={data.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 btn-outline"
          >
            <Music className="w-4 h-4" />
            Press play with me
          </a>
        </section>
      )}

      <footer className="mt-12 flex flex-col items-end">
        <p className="font-script text-3xl sm:text-4xl gradient-text">
          {data.closing || "Forever yours"},
        </p>
        {data.from && (
          <p className="font-script text-3xl sm:text-4xl gradient-text -mt-1">
            {data.from}
          </p>
        )}
      </footer>

      <div
        aria-hidden="true"
        className="absolute right-6 bottom-6 grid place-items-center w-16 h-16 rounded-full opacity-90"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accent.from}, ${accent.to})`,
          boxShadow: `0 10px 30px -10px ${accent.to}`,
        }}
      >
        <Heart
          className="w-7 h-7 text-white animate-heartbeat"
          fill="currentColor"
          strokeWidth={0}
        />
      </div>
    </article>
  );
}
