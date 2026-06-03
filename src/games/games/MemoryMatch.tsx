import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GameShell from "../components/GameShell";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

const EMOJIS = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export default function MemoryMatch() {
  const { haptic } = useTelegramWebApp();
  const [cards, setCards] = useState(() =>
    shuffle([...EMOJIS, ...EMOJIS].map((e, i) => ({ id: i, emoji: e, matched: false }))),
  );
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  const won = cards.every((c) => c.matched);

  const flip = (idx: number) => {
    if (lock || flipped.includes(idx) || cards[idx]!.matched) return;
    const next = [...flipped, idx];
    setFlipped(next);
    haptic("light");
    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = next;
      if (cards[a]!.emoji === cards[b]!.emoji) {
        setCards((c) =>
          c.map((card, i) => (i === a || i === b ? { ...card, matched: true } : card)),
        );
        setFlipped([]);
        setLock(false);
        haptic("success");
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 700);
      }
    }
  };

  useEffect(() => {
    if (won) haptic("success");
  }, [won, haptic]);

  const reset = () => {
    setCards(
      shuffle([...EMOJIS, ...EMOJIS].map((e, i) => ({ id: i, emoji: e, matched: false }))),
    );
    setFlipped([]);
    setMoves(0);
  };

  return (
    <GameShell
      gameId="memory"
      controls={
        <>
          <span className="game-chip">Moves {moves}</span>
          <button type="button" className="game-btn-secondary" onClick={reset}>
            Shuffle
          </button>
        </>
      }
    >
      {won && (
        <p className="text-center text-violet-500 font-semibold mb-2">You matched them all!</p>
      )}
      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
        {cards.map((card, i) => {
          const show = card.matched || flipped.includes(i);
          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => flip(i)}
              whileTap={{ scale: 0.95 }}
              className="game-glass aspect-square flex items-center justify-center text-2xl"
              disabled={card.matched || lock}
            >
              {show ? card.emoji : "?"}
            </motion.button>
          );
        })}
      </div>
    </GameShell>
  );
}
