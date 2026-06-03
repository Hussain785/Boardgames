import { useEffect, useRef, useState } from "react";
import GameShell from "../components/GameShell";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

export default function SkyRunner() {
  const { haptic } = useTelegramWebApp();
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("runner-best") || 0));
  const [dead, setDead] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    y: 0,
    vy: 0,
    grounded: true,
    obstacles: [] as { x: number; w: number; h: number }[],
    speed: 280,
    dist: 0,
  });

  const jump = () => {
    const s = state.current;
    if (s.grounded) {
      s.vy = -420;
      s.grounded = false;
      haptic("light");
    }
  };

  const reset = () => {
    state.current = { y: 0, vy: 0, grounded: true, obstacles: [], speed: 280, dist: 0 };
    setScore(0);
    setDead(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const groundY = () => canvas.height * 0.78;

    const resize = () => {
      const w = canvas.parentElement?.clientWidth ?? 320;
      canvas.width = w;
      canvas.height = Math.min(400, w * 0.65);
    };
    resize();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", jump);

    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = state.current;
      const gY = groundY();
      const playerH = canvas.height * 0.12;

      if (!dead) {
        s.dist += s.speed * dt;
        setScore(Math.floor(s.dist / 10));

        s.vy += 1200 * dt;
        s.y += s.vy * dt;
        if (s.y >= 0) {
          s.y = 0;
          s.vy = 0;
          s.grounded = true;
        }

        if (Math.random() < 0.02 + s.dist / 50000) {
          s.obstacles.push({
            x: canvas.width + 20,
            w: 24 + Math.random() * 30,
            h: 30 + Math.random() * 40,
          });
        }

        s.obstacles = s.obstacles
          .map((o) => ({ ...o, x: o.x - s.speed * dt }))
          .filter((o) => o.x > -60);

        const px = canvas.width * 0.15;
        const py = gY - playerH + s.y;
        for (const o of s.obstacles) {
          if (
            px + playerH * 0.6 > o.x &&
            px < o.x + o.w &&
            py + playerH > gY - o.h
          ) {
            setDead(true);
            haptic("error");
            setBest((b) => {
              const n = Math.max(b, Math.floor(s.dist / 10));
              localStorage.setItem("runner-best", String(n));
              return n;
            });
          }
        }
        s.speed = Math.min(520, 280 + s.dist / 80);
      }

      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "#0ea5e9");
      grad.addColorStop(0.5, "#6366f1");
      grad.addColorStop(1, "#1e1b4b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#334155";
      ctx.fillRect(0, gY, canvas.width, canvas.height - gY);

      ctx.fillStyle = "#fbbf24";
      s.obstacles.forEach((o) => {
        ctx.fillRect(o.x, gY - o.h, o.w, o.h);
      });

      const px = canvas.width * 0.15;
      const py = gY - playerH + s.y;
      ctx.fillStyle = "#f472b6";
      ctx.beginPath();
      ctx.roundRect(px, py, playerH * 0.9, playerH, 8);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillRect(px + playerH * 0.55, py + playerH * 0.25, 6, 6);

      if (dead) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 22px Inter,sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tap to restart", canvas.width / 2, canvas.height / 2);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const restart = () => {
      if (dead) reset();
      else jump();
    };
    canvas.addEventListener("click", restart);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", jump);
      canvas.removeEventListener("click", restart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dead, haptic]);

  return (
    <GameShell
      gameId="runner"
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
      <div className="game-canvas-wrap min-h-[260px]">
        <canvas ref={canvasRef} className="w-full" />
      </div>
      <p className="text-center text-xs text-[rgb(var(--game-muted))] mt-2">
        Tap or space to jump · dodge obstacles
      </p>
    </GameShell>
  );
}
