import { useCallback, useEffect, useState } from "react";
import GameShell from "../components/GameShell";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

type Grid = number[][];

function empty(): Grid {
  return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
}

function spawn(g: Grid): Grid {
  const cells: [number, number][] = [];
  g.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v === 0) cells.push([r, c]);
    }),
  );
  if (!cells.length) return g;
  const [r, c] = cells[Math.floor(Math.random() * cells.length)]!;
  const next = g.map((row) => [...row]);
  next[r]![c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slide(row: number[]): number[] {
  const filtered = row.filter((x) => x);
  const merged: number[] = [];
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i]! * 2);
      i++;
    } else merged.push(filtered[i]!);
  }
  while (merged.length < 4) merged.push(0);
  return merged;
}

function move(g: Grid, dir: "up" | "down" | "left" | "right"): Grid {
  let grid = g.map((r) => [...r]);
  const rot = (m: Grid) => m[0]!.map((_, i) => m.map((row) => row[i]!).reverse());
  if (dir === "up") {
    grid = rot(rot(rot(grid)));
    grid = grid.map(slide);
    return rot(grid);
  }
  if (dir === "down") {
    grid = rot(rot(grid));
    grid = grid.map((row) => slide([...row].reverse()).reverse());
    return rot(rot(grid));
  }
  if (dir === "left") return grid.map(slide);
  grid = grid.map((row) => slide([...row].reverse()).reverse());
  return grid;
}

const TILE_COLORS: Record<number, string> = {
  0: "bg-[rgb(var(--game-surface-2))]",
  2: "bg-slate-300 dark:bg-slate-600",
  4: "bg-orange-300",
  8: "bg-orange-400",
  16: "bg-orange-500 text-white",
  32: "bg-amber-500 text-white",
  64: "bg-amber-600 text-white",
  128: "bg-yellow-500 text-white",
  256: "bg-yellow-400 text-white",
  512: "bg-violet-500 text-white",
  1024: "bg-violet-600 text-white",
  2048: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
};

export default function Game2048() {
  const { haptic } = useTelegramWebApp();
  const [grid, setGrid] = useState(() => spawn(spawn(empty())));

  const apply = useCallback(
    (dir: "up" | "down" | "left" | "right") => {
      const next = move(grid, dir);
      const changed = JSON.stringify(next) !== JSON.stringify(grid);
      if (changed) {
        setGrid(spawn(next));
        haptic("light");
        if (next.some((row) => row.some((v) => v === 2048))) haptic("success");
      }
    },
    [grid, haptic],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") apply("up");
      if (e.key === "ArrowDown") apply("down");
      if (e.key === "ArrowLeft") apply("left");
      if (e.key === "ArrowRight") apply("right");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [apply]);

  const score = grid.flat().reduce((a, b) => a + b, 0);

  return (
    <GameShell
      gameId="game-2048"
      controls={<span className="game-chip">Score {score}</span>}
    >
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto p-2 game-glass">
        {grid.flatMap((row, ri) =>
          row.map((v, ci) => (
            <div
              key={`${ri}-${ci}`}
              className={`aspect-square rounded-xl flex items-center justify-center font-bold text-lg ${TILE_COLORS[v] ?? TILE_COLORS[2048]}`}
            >
              {v || ""}
            </div>
          )),
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 max-w-[180px] mx-auto">
        <div />
        <button type="button" className="game-btn-secondary" onClick={() => apply("up")}>↑</button>
        <div />
        <button type="button" className="game-btn-secondary" onClick={() => apply("left")}>←</button>
        <button type="button" className="game-btn-secondary" onClick={() => apply("down")}>↓</button>
        <button type="button" className="game-btn-secondary" onClick={() => apply("right")}>→</button>
      </div>
    </GameShell>
  );
}
