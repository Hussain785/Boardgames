import { useCallback, useMemo, useState } from "react";
import { Chess } from "chess.js";
import GameShell from "../components/GameShell";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

const PIECES: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

export default function ChessGame() {
  const { haptic } = useTelegramWebApp();
  const [game, setGame] = useState(() => new Chess());
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState("White to move");

  const board = useMemo(() => game.board(), [game]);

  const squareName = (row: number, col: number) =>
    String.fromCharCode(97 + col) + (8 - row);

  const legalMoves = useMemo(() => {
    if (!selected) return [];
    try {
      return game.moves({ square: selected as "a1", verbose: true });
    } catch {
      return [];
    }
  }, [game, selected]);

  const reset = () => {
    setGame(new Chess());
    setSelected(null);
    setStatus("White to move");
  };

  const onSquare = useCallback(
    (row: number, col: number) => {
      const sq = squareName(row, col);
      const piece = board[row]?.[col];

      if (selected) {
        const move = legalMoves.find((m) => m.to === sq);
        if (move) {
          const g = new Chess(game.fen());
          g.move({ from: move.from, to: move.to, promotion: "q" });
          setGame(g);
          setSelected(null);
          haptic("light");
          if (g.isCheckmate()) {
            setStatus(g.turn() === "w" ? "Black wins!" : "White wins!");
            haptic("success");
          } else if (g.isDraw()) setStatus("Draw");
          else setStatus(g.turn() === "w" ? "White to move" : "Black to move");
          return;
        }
      }

      if (piece && piece.color === game.turn()) {
        setSelected(sq);
        haptic("light");
      } else setSelected(null);
    },
    [board, game, haptic, legalMoves, selected],
  );

  return (
    <GameShell
      gameId="chess"
      controls={
        <button type="button" className="game-btn-secondary" onClick={reset}>
          New game
        </button>
      }
    >
      <p className="text-center text-sm text-[rgb(var(--game-muted))] mb-3">{status}</p>
      <div className="game-glass p-2 max-w-sm mx-auto">
        <div className="grid grid-cols-8 border border-[rgb(var(--game-border))] rounded-lg overflow-hidden">
          {board.map((row, ri) =>
            row.map((cell, ci) => {
              const light = (ri + ci) % 2 === 0;
              const sq = squareName(ri, ci);
              const highlight =
                selected === sq || legalMoves.some((m) => m.to === sq);
              const key = cell
                ? cell.color === "w"
                  ? cell.type.toUpperCase()
                  : cell.type
                : "";
              return (
                <button
                  key={sq}
                  type="button"
                  onClick={() => onSquare(ri, ci)}
                  className={`aspect-square flex items-center justify-center text-2xl sm:text-3xl ${
                    light ? "bg-amber-100 dark:bg-amber-900/40" : "bg-amber-800/25"
                  } ${highlight ? "ring-2 ring-inset ring-violet-500" : ""}`}
                >
                  {cell && (
                    <span className={cell.color === "w" ? "text-slate-800" : "text-slate-100"}>
                      {PIECES[key] ?? ""}
                    </span>
                  )}
                </button>
              );
            }),
          )}
        </div>
      </div>
    </GameShell>
  );
}
