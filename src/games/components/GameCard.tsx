import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { GameMeta } from "../lib/types";

export default function GameCard({ game, index }: { game: GameMeta; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Link
        to={`/games/play/${game.id}`}
        className="game-glass group flex flex-col gap-3 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${game.gradient} text-2xl shadow-lg`}
          >
            {game.emoji}
          </div>
          {game.popular && <span className="game-chip">Hot</span>}
        </div>
        <div>
          <h3 className="font-semibold text-[rgb(var(--game-text))] group-hover:text-violet-500 transition-colors">
            {game.title}
          </h3>
          <p className="mt-0.5 text-xs text-[rgb(var(--game-muted))]">{game.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {game.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[rgb(var(--game-border)/0.5)] px-2 py-0.5 text-[10px] font-medium text-[rgb(var(--game-muted))]"
            >
              {tag}
            </span>
          ))}
          {(game.multiplayer === "both" || game.multiplayer === "online") && (
            <span className="rounded-md bg-cyan-500/15 px-2 py-0.5 text-[10px] font-medium text-cyan-600 dark:text-cyan-400">
              Online
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
