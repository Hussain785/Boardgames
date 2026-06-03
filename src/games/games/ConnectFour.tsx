import { useState } from "react";
import GameShell from "../components/GameShell";
import { useMultiplayer } from "../hooks/useMultiplayer";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

type Board = (0 | 1 | 2)[][];

function createBoard(): Board {
  return Array.from({ length: 6 }, () => Array(7).fill(0) as (0 | 1 | 2)[]);
}

function checkWin(b: Board, player: 1 | 2): boolean {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      if (b[r]![c] !== player) continue;
      for (const [dr, dc] of dirs) {
        let n = 1;
        for (let k = 1; k < 4; k++) {
          const nr = r + dr * k;
          const nc = c + dc * k;
          if (nr < 0 || nr >= 6 || nc < 0 || nc >= 7 || b[nr]![nc] !== player) break;
          n++;
        }
        if (n >= 4) return true;
      }
    }
  }
  return false;
}

interface Sync {
  board: Board;
  turn: 1 | 2;
}

export default function ConnectFour() {
  const { haptic } = useTelegramWebApp();
  const mp = useMultiplayer<Sync>();
  const [board, setBoard] = useState(createBoard);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<0 | 1 | 2>(0);

  const drop = (col: number) => {
    if (winner) return;
    const b = board.map((row) => [...row]) as Board;
    for (let r = 5; r >= 0; r--) {
      if (b[r]![col] === 0) {
        b[r]![col] = turn;
        const w = checkWin(b, turn);
        setBoard(b);
        if (w) {
          setWinner(turn);
          haptic("success");
        } else {
          const nt = (turn === 1 ? 2 : 1) as 1 | 2;
          setTurn(nt);
          mp.sendState({ board: b, turn: nt });
          haptic("light");
        }
        break;
      }
    }
  };

  const colors = ["", "bg-red-500", "bg-yellow-400"];

  return (
    <GameShell
      gameId="connect-four"
      multiplayer={{
        roomId: mp.roomId,
        connected: mp.connected,
        onCreateRoom: mp.createRoom,
        onJoinRoom: mp.joinRoom,
        onLeave: mp.leaveRoom,
      }}
      controls={
        <button
          type="button"
          className="game-btn-secondary"
          onClick={() => {
            setBoard(createBoard());
            setTurn(1);
            setWinner(0);
          }}
        >
          Reset
        </button>
      }
    >
      <p className="text-center text-sm mb-3 text-[rgb(var(--game-muted))]">
        {winner ? `Player ${winner} wins!` : `Player ${turn}'s turn`}
      </p>
      <div className="game-glass p-3 max-w-xs mx-auto">
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 7 }, (_, col) => (
            <button
              key={col}
              type="button"
              className="col-span-1 aspect-[0.35] rounded-t-lg bg-indigo-900/80 hover:bg-indigo-800/80 transition"
              onClick={() => drop(col)}
              disabled={!!winner}
              aria-label={`Column ${col + 1}`}
            />
          ))}
          {board.map((row, ri) =>
            row.map((cell, ci) => (
              <div
                key={`${ri}-${ci}`}
                className="aspect-square rounded-full bg-indigo-950/50 flex items-center justify-center p-1"
              >
                <div
                  className={`w-full h-full rounded-full ${cell ? colors[cell] : ""} transition-all`}
                />
              </div>
            )),
          )}
        </div>
      </div>
    </GameShell>
  );
}
