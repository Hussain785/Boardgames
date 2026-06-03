import { Link } from "react-router-dom";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useGamesTheme } from "../hooks/useGamesTheme";
import { getGame } from "../lib/registry";
import InviteFriend from "./InviteFriend";

interface GameShellProps {
  gameId: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  multiplayer?: {
    roomId: string | null;
    connected: boolean;
    supportsOnline?: boolean;
    onCreateRoom: () => Promise<string | void>;
    onJoinRoom: (code: string) => Promise<void>;
    onLeave: () => void;
  };
}

export default function GameShell({
  gameId,
  children,
  controls,
  multiplayer,
}: GameShellProps) {
  const game = getGame(gameId);
  const { isDark, toggle } = useGamesTheme();

  return (
    <div className="mx-auto max-w-lg px-4 pb-8 pt-4 space-y-4">
      <header className="flex items-center gap-3">
        <Link
          to="/games"
          className="game-btn-secondary !p-2.5 !rounded-full shrink-0"
          aria-label="Back to hub"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <motion.h1
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="truncate text-lg font-bold text-[rgb(var(--game-text))]"
          >
            {game?.emoji} {game?.title ?? "Game"}
          </motion.h1>
          <p className="text-xs text-[rgb(var(--game-muted))] truncate">{game?.subtitle}</p>
        </div>
        <button
          type="button"
          className="game-btn-secondary !p-2.5 !rounded-full shrink-0"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </header>

      {multiplayer && (
        <InviteFriend
          gameTitle={game?.title ?? "Game"}
          roomId={multiplayer.roomId}
          connected={multiplayer.connected}
          onCreateRoom={multiplayer.onCreateRoom}
          onJoinRoom={multiplayer.onJoinRoom}
          onLeave={multiplayer.onLeave}
          supportsOnline={multiplayer.supportsOnline}
        />
      )}

      {controls && <div className="flex flex-wrap gap-2">{controls}</div>}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
