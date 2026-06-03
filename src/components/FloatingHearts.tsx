import { useState } from "react";
import { Heart } from "lucide-react";

interface FloatingHeartsProps {
  count?: number;
  className?: string;
}

interface HeartConfig {
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  drift: number;
}

// Deterministic pseudo-random generator (mulberry32). We avoid calling
// Math.random() during render so React 19 purity rules stay happy and
// the layout doesn't reshuffle on every re-render.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildHearts(count: number, seed: number): HeartConfig[] {
  const rand = mulberry32(seed);
  const items: HeartConfig[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      left: rand() * 100,
      size: 14 + rand() * 26,
      delay: rand() * 8,
      duration: 10 + rand() * 12,
      opacity: 0.25 + rand() * 0.45,
      drift: (rand() - 0.5) * 80,
    });
  }
  return items;
}

/**
 * A purely decorative, low-cost layer of floating hearts that drift
 * upward in the background. Pointer-events: none so it never blocks UI.
 */
export default function FloatingHearts({
  count = 14,
  className = "",
}: FloatingHeartsProps) {
  const [hearts] = useState(() =>
    buildHearts(count, ((Date.now() & 0xffffffff) ^ (count * 9301)) >>> 0)
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <style>{`
        @keyframes lovelink-rise {
          0% { transform: translate3d(0, 110%, 0) rotate(0deg) scale(0.85); opacity: 0; }
          15% { opacity: var(--o, 0.5); }
          50% { transform: translate3d(var(--drift), 50%, 0) rotate(8deg) scale(1); }
          100% { transform: translate3d(calc(var(--drift) * 1.4), -30%, 0) rotate(-8deg) scale(0.95); opacity: 0; }
        }
      `}</style>
      {hearts.map((h, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${h.left}%`,
            bottom: 0,
            width: h.size,
            height: h.size,
            color: "#ff6b9c",
            ["--o" as never]: h.opacity,
            ["--drift" as never]: `${h.drift}px`,
            animation: `lovelink-rise ${h.duration}s ease-in ${h.delay}s infinite`,
            filter: "drop-shadow(0 6px 14px rgba(230,33,104,0.25))",
          }}
        >
          <Heart
            fill="currentColor"
            strokeWidth={0}
            style={{ width: "100%", height: "100%" }}
          />
        </span>
      ))}
    </div>
  );
}
