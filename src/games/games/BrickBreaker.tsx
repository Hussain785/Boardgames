import { useEffect, useRef, useState } from "react";
import GameShell from "../components/GameShell";

export default function BrickBreaker() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    paddleX: 0,
    ball: { x: 0, y: 0, vx: 200, vy: -220 },
    bricks: [] as { x: number; y: number; w: number; h: number; alive: boolean }[],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const w = canvas.parentElement?.clientWidth ?? 320;
      canvas.width = w;
      canvas.height = Math.min(420, w * 0.85);
      const s = state.current;
      s.paddleX = w / 2 - 40;
      s.ball = { x: w / 2, y: canvas.height - 60, vx: 200, vy: -220 };
      if (s.bricks.length === 0) {
        const cols = 7;
        const bw = (w - 40) / cols - 4;
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < cols; col++) {
            s.bricks.push({
              x: 20 + col * (bw + 4),
              y: 40 + row * 22,
              w: bw,
              h: 18,
              alive: true,
            });
          }
        }
      }
    };
    resize();

    let raf = 0;
    let last = performance.now();
    const paddleW = 80;
    const ballR = 8;

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.current.paddleX = Math.max(
        0,
        Math.min(canvas.width - paddleW, ((e.clientX - rect.left) / rect.width) * canvas.width - paddleW / 2),
      );
    };
    canvas.addEventListener("pointermove", onMove);

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      const s = state.current;
      const w = canvas.width;
      const h = canvas.height;

      s.ball.x += s.ball.vx * dt;
      s.ball.y += s.ball.vy * dt;

      if (s.ball.x < ballR || s.ball.x > w - ballR) s.ball.vx *= -1;
      if (s.ball.y < ballR) s.ball.vy *= -1;

      const py = h - 28;
      if (
        s.ball.y + ballR > py &&
        s.ball.y < py + 12 &&
        s.ball.x > s.paddleX &&
        s.ball.x < s.paddleX + paddleW
      ) {
        s.ball.vy = -Math.abs(s.ball.vy);
        s.ball.vx += (s.ball.x - (s.paddleX + paddleW / 2)) * 2;
      }

      if (s.ball.y > h) {
        setLives((l) => {
          if (l <= 1) {
            s.ball = { x: w / 2, y: h - 60, vx: 200, vy: -220 };
            return 3;
          }
          s.ball = { x: w / 2, y: h - 60, vx: 200, vy: -220 };
          return l - 1;
        });
      }

      s.bricks.forEach((b) => {
        if (
          b.alive &&
          s.ball.x > b.x &&
          s.ball.x < b.x + b.w &&
          s.ball.y > b.y &&
          s.ball.y < b.y + b.h
        ) {
          b.alive = false;
          s.ball.vy *= -1;
          setScore((sc) => sc + 10);
        }
      });

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);

      s.bricks.forEach((b, i) => {
        if (!b.alive) return;
        ctx.fillStyle = `hsl(${(i * 40) % 360}, 70%, 55%)`;
        ctx.roundRect(b.x, b.y, b.w, b.h, 4);
        ctx.fill();
      });

      ctx.fillStyle = "#a78bfa";
      ctx.roundRect(s.paddleX, py, paddleW, 10, 5);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, ballR, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <GameShell
      gameId="brick-breaker"
      controls={
        <>
          <span className="game-chip">Score {score}</span>
          <span className="game-chip">Lives {lives}</span>
        </>
      }
    >
      <div className="game-canvas-wrap min-h-[300px]">
        <canvas ref={canvasRef} className="w-full touch-none" />
      </div>
      <p className="text-center text-xs text-[rgb(var(--game-muted))] mt-2">
        Move finger to steer the paddle
      </p>
    </GameShell>
  );
}
