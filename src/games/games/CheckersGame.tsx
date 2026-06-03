import { useState } from "react";
import GameShell from "../components/GameShell";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

type Piece = null | "r" | "R" | "b" | "B";

function initBoard(): Piece[][] {
  const b: Piece[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) b[r]![c] = "b";
    }
  }
  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) b[r]![c] = "r";
    }
  }
  return b;
}

export default function CheckersGame() {
  const { haptic } = useTelegramWebApp();
  const [board, setBoard] = useState(initBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<"r" | "b">("r");

  const isDark = (r: number, c: number) => (r + c) % 2 === 1;

  const tryMove = (toR: number, toC: number) => {
    if (!selected) return;
    const [fr, fc] = selected;
    const piece = board[fr]![fc];
    if (!piece) return;
    const dr = toR - fr;
    const dc = toC - fc;
    const next = board.map((row) => [...row]) as Piece[][];
    if (Math.abs(dr) === 1 && Math.abs(dc) === 1 && !next[toR]![toC]) {
      next[fr]![fc] = null;
      next[toR]![toC] = piece;
      if (turn === "r" && toR === 7) next[toR]![toC] = "R";
      if (turn === "b" && toR === 0) next[toR]![toC] = "B";
      setBoard(next);
      setSelected(null);
      setTurn(turn === "r" ? "b" : "r");
      haptic("light");
    } else if (Math.abs(dr) === 2 && Math.abs(dc) === 2) {
      const midR = fr + dr / 2;
      const midC = fc + dc / 2;
      const jumped = next[midR]![midC];
      if (jumped && jumped.toLowerCase() !== turn && !next[toR]![toC]) {
        next[fr]![fc] = null;
        next[midR]![midC] = null;
        next[toR]![toC] = piece === "r" ? (toR === 7 ? "R" : "r") : toR === 0 ? "B" : "b";
        setBoard(next);
        setSelected(null);
        setTurn(turn === "r" ? "b" : "r");
        haptic("success");
      }
    }
  };

  return (
    <GameShell
      gameId="checkers"
      controls={
        <span className="game-chip">{turn === "r" ? "Red" : "Black"} to move</span>
      }
    >
      <div className="game-glass p-2 max-w-sm mx-auto">
        <div className="grid grid-cols-8 gap-0 border border-[rgb(var(--game-border))] rounded-lg overflow-hidden">
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                type="button"
                disabled={!isDark(r, c)}
                onClick={() => {
                  if (!isDark(r, c)) return;
                  if (selected) tryMove(r, c);
                  else if (cell && cell.toLowerCase() === turn) setSelected([r, c]);
                }}
                className={`aspect-square flex items-center justify-center text-xl ${
                  isDark(r, c) ? "bg-stone-700" : "bg-stone-400/30"
                } ${selected?.[0] === r && selected[1] === c ? "ring-2 ring-violet-500" : ""}`}
              >
                {cell && (
                  <span
                    className={`w-7 h-7 rounded-full border-2 border-white/30 shadow-md ${
                      cell.toLowerCase() === "r" ? "bg-red-500" : "bg-slate-900"
                    } ${cell === cell.toUpperCase() ? "ring-2 ring-yellow-400" : ""}`}
                  />
                )}
              </button>
            )),
          )}
        </div>
      </div>
    </GameShell>
  );
}
