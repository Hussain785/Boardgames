import { useEffect, useRef, useState } from "react";
import GameShell from "../components/GameShell";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  pocketed?: boolean;
}

export default function CarromGame() {
  const { haptic } = useTelegramWebApp();
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [turn, setTurn] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balls = useRef<Ball[]>([]);
  const striker = useRef({ x: 0, y: 0, aiming: false, ax: 0, ay: 0 });
  const animating = useRef(false);

  const initBalls = (w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const coins: Ball[] = [
      { x: cx, y: cy, vx: 0, vy: 0, r: 10, color: "#fbbf24" },
    ];
    const colors = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7"];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      coins.push({
        x: cx + Math.cos(a) * 36,
        y: cy + Math.sin(a) * 36,
        vx: 0,
        vy: 0,
        r: 8,
        color: colors[i % 4]!,
      });
    }
    balls.current = coins;
    striker.current = { x: cx, y: h - 40, aiming: false, ax: 0, ay: 0 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const w = canvas.parentElement?.clientWidth ?? 320;
      canvas.width = w;
      canvas.height = w;
      if (balls.current.length === 0) initBalls(w, w);
    };
    resize();

    let raf = 0;
    const pockets = () => {
      const w = canvas.width;
      const m = 20;
      return [
        { x: m, y: m },
        { x: w - m, y: m },
        { x: m, y: w - m },
        { x: w - m, y: w - m },
      ];
    };

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (!animating.current) {
        // physics idle
      } else {
        let moving = false;
        balls.current.forEach((b) => {
          if (b.pocketed) return;
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= 0.985;
          b.vy *= 0.985;
          if (Math.abs(b.vx) > 0.1 || Math.abs(b.vy) > 0.1) moving = true;
          if (b.x < b.r || b.x > w - b.r) b.vx *= -0.8;
          if (b.y < b.r || b.y > h - b.r) b.vy *= -0.8;
          pockets().forEach((p) => {
            const d = Math.hypot(b.x - p.x, b.y - p.y);
            if (d < 22 && !b.pocketed) {
              b.pocketed = true;
              b.vx = b.vy = 0;
              if (b.color !== "#fbbf24") {
                setScore((s) => ({
                  ...s,
                  [turn === 0 ? "p1" : "p2"]: s[turn === 0 ? "p1" : "p2"] + 1,
                }));
                haptic("success");
              }
            }
          });
        });
        const st = striker.current;
        st.x += st.ax * 0.02;
        st.y += st.ay * 0.02;
        if (!moving) {
          animating.current = false;
          setTurn((t) => (t + 1) % 2);
        }
      }

      ctx.fillStyle = "#78350f";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#fcd34d";
      ctx.lineWidth = 3;
      ctx.strokeRect(12, 12, w - 24, h - 24);

      pockets().forEach((p) => {
        ctx.fillStyle = "#1c1917";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fill();
      });

      balls.current.forEach((b) => {
        if (b.pocketed) return;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const st = striker.current;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(st.x, st.y, 14, 0, Math.PI * 2);
      ctx.fill();

      if (st.aiming) {
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x - st.ax * 0.15, st.y - st.ay * 0.15);
        ctx.stroke();
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
      const st = striker.current;
      if (!animating.current) {
        if (e.type === "pointerdown") {
          st.aiming = true;
          st.ax = st.x - x;
          st.ay = st.y - y;
        } else if (e.type === "pointerup" && st.aiming) {
          st.aiming = false;
          animating.current = true;
          const queen = balls.current[0];
          if (queen && !queen.pocketed) {
            queen.vx = st.ax * 0.08;
            queen.vy = st.ay * 0.08;
          }
          balls.current.slice(1).forEach((b, i) => {
            if (!b.pocketed) {
              b.vx = st.ax * 0.05 * (i % 2 ? 1 : -1);
              b.vy = st.ay * 0.05;
            }
          });
          haptic("light");
        } else if (e.type === "pointermove" && st.aiming) {
          st.ax = st.x - x;
          st.ay = st.y - y;
        }
      }
    };

    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerup", onPointer);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerup", onPointer);
    };
  }, [haptic, turn]);

  return (
    <GameShell
      gameId="carrom"
      controls={
        <span className="game-chip">
          P1 {score.p1} · P2 {score.p2} · Turn P{turn + 1}
        </span>
      }
    >
      <div className="game-canvas-wrap aspect-square">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <p className="text-center text-xs text-[rgb(var(--game-muted))] mt-2">
        Drag from striker and release to shoot
      </p>
    </GameShell>
  );
}
