import { useEffect, useRef, useState } from "react";
import GameShell from "../components/GameShell";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

const MAZE = [
  "###################",
  "#........#........#",
  "#.###.###.#.###.##",
  "#.................#",
  "###.#.#####.#.###",
  "#...#...#...#...#",
  "#.##### # #####.#",
  "#.......#.......#",
  "#.###.#####.###.#",
  "#...............#",
  "#.###.#.###.#.###",
  "#.....#..P..#.....#",
  "###.#.#####.#.###",
  "#........#........#",
  "#.####.#.#.####.#",
  "#......#.#......#",
  "###################",
];

export default function PacMan() {
  const { haptic } = useTelegramWebApp();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    px: 9,
    py: 11,
    dir: { x: 0, y: 0 },
    dots: new Set<string>(),
    ghosts: [
      { x: 8, y: 9, c: "#f43f5e" },
      { x: 9, y: 9, c: "#a78bfa" },
      { x: 10, y: 9, c: "#22d3ee" },
    ],
    tick: 0,
  });

  useEffect(() => {
    const dots = new Set<string>();
    MAZE.forEach((row, y) =>
      row.split("").forEach((c, x) => {
        if (c === ".") dots.add(`${x},${y}`);
      }),
    );
    state.current.dots = dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const rows = MAZE.length;
    const cols = MAZE[0]!.length;

    const resize = () => {
      const w = canvas.parentElement?.clientWidth ?? 320;
      canvas.width = w;
      canvas.height = (w / cols) * rows;
    };
    resize();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") state.current.dir = { x: -1, y: 0 };
      if (e.key === "ArrowRight") state.current.dir = { x: 1, y: 0 };
      if (e.key === "ArrowUp") state.current.dir = { x: 0, y: -1 };
      if (e.key === "ArrowDown") state.current.dir = { x: 0, y: 1 };
    };
    window.addEventListener("keydown", onKey);

    let raf = 0;
    let last = 0;

    const walkable = (x: number, y: number) => {
      const row = MAZE[y];
      if (!row) return false;
      const c = row[x];
      return c && c !== "#";
    };

    const loop = (t: number) => {
      if (t - last > 140) {
        last = t;
        const s = state.current;
        s.tick++;
        const nx = s.px + s.dir.x;
        const ny = s.py + s.dir.y;
        if (walkable(nx, ny)) {
          s.px = nx;
          s.py = ny;
          const key = `${nx},${ny}`;
          if (s.dots.has(key)) {
            s.dots.delete(key);
            setScore((sc) => sc + 10);
            haptic("light");
          }
        }
        s.ghosts.forEach((g) => {
          const opts = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ].filter((d) => walkable(g.x + d.x, g.y + d.y));
          const pick = opts[Math.floor(Math.random() * opts.length)]!;
          g.x += pick.x;
          g.y += pick.y;
          if (g.x === s.px && g.y === s.py) {
            setLives((l) => {
              if (l <= 1) {
                s.px = 9;
                s.py = 11;
                return 3;
              }
              haptic("error");
              s.px = 9;
              s.py = 11;
              return l - 1;
            });
          }
        });
        if (s.dots.size === 0) {
          MAZE.forEach((row, y) =>
            row.split("").forEach((c, x) => {
              if (c === ".") s.dots.add(`${x},${y}`);
            }),
          );
          haptic("success");
        }
      }

      const cw = canvas.width / cols;
      const ch = canvas.height / rows;
      ctx.fillStyle = "#0c0a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      MAZE.forEach((row, y) => {
        row.split("").forEach((c, x) => {
          if (c === "#") {
            ctx.fillStyle = "#312e81";
            ctx.fillRect(x * cw, y * ch, cw, ch);
          }
        });
      });

      state.current.dots.forEach((key) => {
        const [x, y] = key.split(",").map(Number);
        ctx.fillStyle = "#fde68a";
        ctx.beginPath();
        ctx.arc(x! * cw + cw / 2, y! * ch + ch / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      const s = state.current;
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(s.px * cw + cw / 2, s.py * ch + ch / 2, cw * 0.4, 0.2, Math.PI * 2 - 0.2);
      ctx.lineTo(s.px * cw + cw / 2, s.py * ch + ch / 2);
      ctx.fill();

      s.ghosts.forEach((g) => {
        ctx.fillStyle = g.c;
        ctx.beginPath();
        ctx.arc(g.x * cw + cw / 2, g.y * ch + ch / 2, cw * 0.35, Math.PI, 0);
        ctx.fill();
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [haptic]);

  return (
    <GameShell
      gameId="pac-man"
      controls={
        <>
          <span className="game-chip">Score {score}</span>
          <span className="game-chip">Lives {"❤️".repeat(lives)}</span>
        </>
      }
    >
      <div className="game-canvas-wrap">
        <canvas ref={canvasRef} />
      </div>
      <p className="text-center text-xs text-[rgb(var(--game-muted))] mt-2">
        Arrow keys or swipe to move
      </p>
    </GameShell>
  );
}
