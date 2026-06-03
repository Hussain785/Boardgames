import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import GameCard from "../components/GameCard";
import { GAMES } from "../lib/registry";
const FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
  { id: "arcade", label: "Arcade" },
  { id: "board", label: "Board" },
  { id: "party", label: "Party" },
  { id: "puzzle", label: "Puzzle" },
  { id: "classic", label: "Classic" },
];

export default function Hub() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const games = useMemo(() => {
    let list = GAMES;
    if (filter === "popular") list = list.filter((g) => g.popular);
    else if (filter !== "all") list = list.filter((g) => g.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.subtitle.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [query, filter]);

  return (
    <div className="mx-auto max-w-lg px-4 pb-28 pt-4">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-glass relative overflow-hidden p-5 mb-6"
      >
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-cyan-500/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-violet-500 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Telegram Mini App · 2026
          </div>
          <h1 className="mt-2 text-2xl font-bold text-[rgb(var(--game-text))]">
            Play together, anywhere
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--game-muted))] leading-relaxed">
            Premium arcade & board games with online rooms, dark mode, and buttery-smooth
            touch controls.
          </p>
        </div>
      </motion.section>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--game-muted))]" />
        <input
          type="search"
          placeholder="Search games…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-[rgb(var(--game-border))] bg-[rgb(var(--game-surface-2))] py-2.5 pl-10 pr-4 text-sm text-[rgb(var(--game-text))] placeholder:text-[rgb(var(--game-muted))] focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.id + f.label}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === f.id
                ? "bg-violet-500 text-white shadow-md"
                : "bg-[rgb(var(--game-border)/0.4)] text-[rgb(var(--game-muted))] hover:text-[rgb(var(--game-text))]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {games.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} />
        ))}
      </div>

      {games.length === 0 && (
        <p className="text-center text-sm text-[rgb(var(--game-muted))] py-12">
          No games match your search.
        </p>
      )}
    </div>
  );
}
