import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { Gamepad2, Home, Moon, Sun } from "lucide-react";
import { useGamesTheme } from "../hooks/useGamesTheme";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";
import "../styles/games.css";

export default function GamesLayout() {
  const { isDark, toggle } = useGamesTheme();
  const { displayName, isTelegram } = useTelegramWebApp();

  return (
    <div className={`games-root ${isDark ? "dark" : ""}`}>
      <header className="sticky top-0 z-40 border-b border-[rgb(var(--game-border)/0.6)] bg-[rgb(var(--game-surface)/0.85)] backdrop-blur-xl safe-area-inset-top">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link to="/games" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-[rgb(var(--game-text))]">
                PlayVerse
              </span>
              <span className="block text-[10px] text-[rgb(var(--game-muted))]">
                {isTelegram ? `Hi, ${displayName}` : "Mini games hub"}
              </span>
            </div>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="game-btn-secondary !p-2 !rounded-full"
              onClick={toggle}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/" className="game-btn-ghost !p-2 !rounded-full" title="Lovelink home">
              <Home className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <Outlet />

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgb(var(--game-border)/0.6)] bg-[rgb(var(--game-surface)/0.9)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-lg justify-around px-4 py-2">
          <Link
            to="/games"
            className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-violet-500"
          >
            <Gamepad2 className="h-5 w-5" />
            Games
          </Link>
        </div>
      </nav>
    </div>
  );
}
