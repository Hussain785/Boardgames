import { useState } from "react";
import { motion } from "framer-motion";
import GameShell from "../components/GameShell";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

const SNAKES: Record<number, number> = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
const LADDERS: Record<number, number> = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

const PLAYERS = ["🔴", "🔵"];

export default function SnakesAndLadders() {
  const { haptic } = useTelegramWebApp();
  const [pos, setPos] = useState([1, 1]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [msg, setMsg] = useState("Roll the dice!");

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    haptic("light");
    let frames = 0;
    const interval = setInterval(() => {
      setDice(Math.ceil(Math.random() * 6));
      frames++;
      if (frames > 8) {
        clearInterval(interval);
        const d = Math.ceil(Math.random() * 6);
        setDice(d);
        setRolling(false);
        applyMove(d);
        haptic("success");
      }
    }, 80);
  };

  const applyMove = (d: number) => {
    setPos((prev) => {
      const next = [...prev] as number[];
      let p = Math.min(100, next[turn]! + d);
      if (SNAKES[p]) {
        p = SNAKES[p]!;
        setMsg(`🐍 Snake! ${PLAYERS[turn]} slides down`);
      } else if (LADDERS[p]) {
        p = LADDERS[p]!;
        setMsg(`🪜 Ladder! ${PLAYERS[turn]} climbs up`);
      } else if (p === 100) {
        setMsg(`${PLAYERS[turn]} wins!`);
        haptic("success");
      } else {
        setMsg(`${PLAYERS[turn]} moved to ${p}`);
      }
      next[turn] = p;
      if (p < 100) setTurn((t) => (t + 1) % 2);
      return next;
    });
  };

  const cellPos = (n: number) => {
    const row = Math.floor((n - 1) / 10);
    const col = (n - 1) % 10;
    const rev = row % 2 === 1;
    const x = rev ? 9 - col : col;
    return { row: 9 - row, col: x };
  };

  return (
    <GameShell
      gameId="snakes-ladders"
      controls={
        <button type="button" className="game-btn-primary" onClick={roll} disabled={rolling}>
          {dice ? `🎲 ${dice}` : "Roll"} — {PLAYERS[turn]}&apos;s turn
        </button>
      }
    >
      <p className="text-center text-sm text-[rgb(var(--game-muted))] mb-2">{msg}</p>
      <div className="game-glass p-2 aspect-square max-w-sm mx-auto">
        <div className="grid grid-cols-10 grid-rows-10 gap-0.5 h-full w-full">
          {Array.from({ length: 100 }, (_, i) => {
            const n = 100 - i;
            const { row, col } = cellPos(n);
            const onCell = pos.map((p, pi) => (p === n ? PLAYERS[pi] : null)).filter(Boolean);
            return (
              <div
                key={n}
                style={{ gridRow: row + 1, gridColumn: col + 1 }}
                className={`relative flex items-center justify-center rounded-sm text-[8px] font-bold ${
                  SNAKES[n] ? "bg-rose-500/20" : LADDERS[n] ? "bg-emerald-500/20" : "bg-[rgb(var(--game-surface-2))]"
                }`}
              >
                <span className="text-[rgb(var(--game-muted))] opacity-60">{n}</span>
                {onCell.map((e, j) => (
                  <motion.span
                    key={j}
                    layout
                    className="absolute text-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
