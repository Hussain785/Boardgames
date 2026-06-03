import { useState } from "react";
import { motion } from "framer-motion";
import GameShell from "../components/GameShell";
import { rollDice } from "../lib/random";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308"];
const TRACK = 52;

export default function LudoGame() {
  const { haptic } = useTelegramWebApp();
  const [tokens, setTokens] = useState([
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
  ]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState(1);
  const [msg, setMsg] = useState("Player 1 — roll!");

  const roll = () => {
    const d = rollDice();
    setDice(d);
    haptic("light");
    moveToken(d);
  };

  const moveToken = (d: number) => {
    setTokens((prev) => {
      const next = prev.map((p) => [...p]) as number[][];
      const player = turn;
      const idx = next[player]!.findIndex((t) => t >= -1 && t < 56);
      if (idx === -1) {
        setMsg("No movable token");
        return prev;
      }
      let t = next[player]![idx]!;
      if (t === -1) {
        if (d !== 6) {
          setMsg("Need 6 to leave home");
          setTurn((t0) => (t0 + 1) % 2);
          return prev;
        }
        t = 0;
      } else {
        t = Math.min(56, t + d);
      }
      next[player]![idx] = t;
      if (t === 56) setMsg(`Player ${player + 1} token home!`);
      else setMsg(`Player ${player + 1} moved`);
      setTurn((t0) => (t0 + 1) % 2);
      haptic("success");
      return next;
    });
  };

  return (
    <GameShell
      gameId="ludo"
      controls={
        <button type="button" className="game-btn-primary" onClick={roll}>
          🎲 Roll {dice}
        </button>
      }
    >
      <p className="text-center text-sm mb-3 text-[rgb(var(--game-muted))]">{msg}</p>
      <div className="game-glass aspect-square max-w-sm mx-auto p-4 relative">
        <div className="absolute inset-4 grid grid-cols-3 grid-rows-3 gap-1">
          <div className="rounded-xl" style={{ background: COLORS[0] + "33" }} />
          <div className="col-span-1 row-span-1 flex items-center justify-center">
            <span className="text-4xl">🎲</span>
          </div>
          <div className="rounded-xl" style={{ background: COLORS[1] + "33" }} />
          <div className="col-span-3 flex items-center justify-center bg-[rgb(var(--game-surface-2))] rounded-xl">
            <div className="grid grid-cols-4 gap-3">
              {tokens[turn]!.map((pos, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: pos >= 0 ? 1.1 : 1 }}
                  className="h-10 w-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: COLORS[turn] }}
                >
                  {pos === -1 ? "🏠" : pos}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="rounded-xl opacity-30" style={{ background: COLORS[2] + "33" }} />
          <div />
          <div className="rounded-xl opacity-30" style={{ background: COLORS[3] + "33" }} />
        </div>
        <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-[rgb(var(--game-muted))]">
          2-player quick Ludo · {TRACK} steps to win
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {[0, 1].map((p) => (
          <div
            key={p}
            className={`px-3 py-1 rounded-full text-xs font-bold ${turn === p ? "ring-2 ring-violet-500" : ""}`}
            style={{ background: COLORS[p] + "40", color: COLORS[p] }}
          >
            P{p + 1}
          </div>
        ))}
      </div>
    </GameShell>
  );
}
