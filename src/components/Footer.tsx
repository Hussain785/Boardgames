import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 pb-10 pt-8 border-t border-rose-200/40 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-rose-700/80 dark:text-rose-200/70">
        <p className="flex items-center gap-2">
          Made with
          <span className="inline-grid place-items-center w-5 h-5 rounded-full bg-rose-500 text-white">
            <Heart
              className="w-3 h-3 animate-heartbeat"
              fill="currentColor"
              strokeWidth={0}
            />
          </span>
          for the ones who love across the miles.
        </p>
        <p className="text-xs opacity-80">
          Your letters are encoded in the share link and never sent to a server.
        </p>
      </div>
    </footer>
  );
}
