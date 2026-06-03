import { useCallback, useEffect, useRef, useState } from "react";
import GameShell from "../components/GameShell";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

const GRID = 16;

export default function SnakeGame() {
  const { haptic } = useTelegramWebApp();
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("snake-best") || 0));
  const [gameOver, setGameOver] = useState(false);
  const state = useRef({
    snake: [{ x: 8, y: 8 }],
    dir: { x: 1, y: 0 },
    food: { x: 12, y: 8 },
    tick: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const spawnFood = useCallback((snake: { x: number; y: number }[]) => {
    let f = { x: 5, y: 5 };
    while (snake.some((s) => s.x === f.x && s.y === f.y)) {
      f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    }
    return f;
  }, []);

  const reset = useCallback(() => {
    state.current = {
      snake: [{ x: 8, y: 8 }],
      dir: { x: 1, y: 0 },
      food: { x: 12, y: 8 },
      tick: 0,
    };
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = state.current.dir;
      if (e.key === "ArrowUp" && d.y !== 1) state.current.dir = { x: 0, y: -1 };
      if (e.key === "ArrowDown" && d.y !== -1) state.current.dir = { x: 0, y: 1 };
      if (e.key === "ArrowLeft" && d.x !== 1) state.current.dir = { x: -1, y: 0 };
      if (e.key === "ArrowRight" && d.x !== -1) state.current.dir = { x: 1, y: 0 };
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = 0;

    const resize = () => {
      const size = Math.min(canvas.parentElement?.clientWidth ?? 320, 360);
      canvas.width = size;
      canvas.height = size;
    };
    resize();

    const cell = () => canvas.width / GRID;

    const loop = (t: number) => {
      if (t - last > 120) {
        last = t;
        const s = state.current;
        if (!gameOver) {
          s.tick++;
          if (s.tick % 1 === 0) {
            const head = s.snake[0]!;
            const nh = { x: head.x + s.dir.x, y: head.y + s.dir.y };
            if (nh.x < 0 || nh.y < 0 || nh.x >= GRID || nh.y >= GRID || s.snake.some((p) => p.x === nh.x && p.y === nh.y)) {
              setGameOver(true);
              haptic("error");
              setBest((b) => {
                const n = Math.max(b, score);
                localStorage.setItem("snake-best", String(n));
                return n;
              });
            } else {
              s.snake.unshift(nh);
              if (nh.x === s.food.x && nh.y === s.food.y) {
                setScore((sc) => sc + 1);
                haptic("success");
                s.food = spawnFood(s.snake);
              } else {
                s.snake.pop();
              }
            }
          }
        }
      }

      const c = cell();
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#22c55e";
      state.current.snake.forEach((p, i) => {
        ctx.globalAlpha = 1 - i * 0.03;
        ctx.fillRect(p.x * c + 1, p.y * c + 1, c - 2, c - 2);
      });
      ctx.globalAlpha = 1;

      ctx.fillStyle = "#f43f5e";
      const f = state.current.food;
      ctx.beginPath();
      ctx.arc(f.x * c + c / 2, f.y * c + c / 2, c / 2 - 2, 0, Math.PI * 2);
      ctx.fill();

      if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px Inter,sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [gameOver, score, spawnFood, haptic]);

  const swipe = (dx: number, dy: number) => {
    const d = state.current.dir;
    if (dx && d.x !== -dx) state.current.dir = { x: dx, y: 0 };
    if (dy && d.y !== -dy) state.current.dir = { x: 0, y: dy };
  };

  return (
    <GameShell
      gameId="snake"
      controls={
        <>
          <span className="game-chip">Score {score}</span>
          <span className="game-chip">Best {best}</span>
          <button type="button" className="game-btn-secondary" onClick={reset}>
            Restart
          </button>
        </>
      }
    >
      <div
        className="game-canvas-wrap"
        onTouchStart={(e) => {
          const t = e.touches[0];
          (e.currentTarget as HTMLElement & { _sx?: number })._sx = t?.clientX;
          (e.currentTarget as HTMLElement & { _sy?: number })._sy = t?.clientY;
        }}
        onTouchEnd={(e) => {
          const el = e.currentTarget as HTMLElement & { _sx?: number; _sy?: number };
          const t = e.changedTouches[0];
          if (!t || el._sx == null || el._sy == null) return;
          const dx = t.clientX - el._sx;
          const dy = t.clientY - el._sy;
          if (Math.abs(dx) > Math.abs(dy)) swipe(dx > 0 ? 1 : -1, 0);
          else swipe(0, dy > 0 ? 1 : -1);
        }}
      >
        <canvas ref={canvasRef} />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 max-w-[200px] mx-auto">
        <div />
        <button type="button" className="game-btn-secondary" onClick={() => swipe(0, -1)}>↑</button>
        <div />
        <button type="button" className="game-btn-secondary" onClick={() => swipe(-1, 0)}>←</button>
        <button type="button" className="game-btn-secondary" onClick={() => swipe(0, 1)}>↓</button>
        <button type="button" className="game-btn-secondary" onClick={() => swipe(1, 0)}>→</button>
      </div>
    </GameShell>
  );
}
