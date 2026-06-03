import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GameShell from "../components/GameShell";
import { useMultiplayer } from "../hooks/useMultiplayer";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

type Cell = "X" | "O" | null;
type Board = Cell[];

function winner(b: Board): Cell | "draw" | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, c, d] of lines) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  if (b.every(Boolean)) return "draw";
  return null;
}

interface SyncState {
  board: Board;
  turn: "X" | "O";
}

export default function TicTacToe() {
  const { haptic } = useTelegramWebApp();
  const mp = useMultiplayer<SyncState>();
  const [params] = useSearchParams();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [mode, setMode] = useState<"local" | "online">("local");

  const myMark: "X" | "O" = mp.isHost ? "X" : "O";
  const online = mode === "online" && mp.roomId;
  const canPlay = !online || (mp.connected && turn === myMark);

  useEffect(() => {
    const room = params.get("room");
    if (room && !mp.roomId) void mp.joinRoom(room);
  }, [params, mp]);


  const sync = useCallback(
    (b: Board, t: "X" | "O") => {
      if (online) mp.sendState({ board: b, turn: t });
    },
    [online, mp],
  );

  const play = (i: number) => {
    if (board[i] || winner(board) || !canPlay) return;
    const next = [...board] as Board;
    next[i] = turn;
    const w = winner(next);
    const nextTurn = turn === "X" ? "O" : "X";
    setBoard(next);
    setTurn(nextTurn);
    sync(next, nextTurn);
    haptic(w ? "success" : "light");
  };

  const reset = () => {
    const empty = Array(9).fill(null) as Board;
    setBoard(empty);
    setTurn("X");
    sync(empty, "X");
  };

  const w = winner(board);

  return (
    <GameShell
      gameId="tic-tac-toe"
      multiplayer={{
        roomId: mp.roomId,
        connected: mp.connected,
        onCreateRoom: async () => {
          setMode("online");
          return mp.createRoom();
        },
        onJoinRoom: async (code) => {
          setMode("online");
          await mp.joinRoom(code);
        },
        onLeave: () => {
          mp.leaveRoom();
          setMode("local");
          reset();
        },
      }}
      controls={
        <>
          <button type="button" className="game-btn-secondary" onClick={() => setMode("local")}>
            Local 2P
          </button>
          <button type="button" className="game-btn-secondary" onClick={reset}>
            Reset
          </button>
        </>
      }
    >
      <div className="game-glass p-4">
        <p className="text-center text-sm text-[rgb(var(--game-muted))] mb-4">
          {w === "draw"
            ? "Draw!"
            : w
              ? `${w} wins!`
              : online
                ? mp.connected
                  ? `Turn: ${turn} ${turn === myMark ? "(you)" : "(friend)"}`
                  : "Waiting for friend…"
                : `Turn: ${turn}`}
        </p>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {board.map((cell, i) => (
            <button
              key={i}
              type="button"
              onClick={() => play(i)}
              className="aspect-square rounded-2xl bg-[rgb(var(--game-surface-2))] text-3xl font-bold transition-all hover:bg-violet-500/10 active:scale-95 disabled:opacity-60"
              disabled={!!cell || !!w || !canPlay}
            >
              <span className={cell === "X" ? "text-violet-500" : "text-cyan-500"}>{cell}</span>
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
