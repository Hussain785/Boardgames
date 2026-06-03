import { useState } from "react";
import { motion } from "framer-motion";
import GameShell from "../components/GameShell";
import { randomChoice } from "../lib/random";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

type Choice = "rock" | "paper" | "scissors";

const EMOJI: Record<Choice, string> = { rock: "✊", paper: "✋", scissors: "✌️" };

function winner(a: Choice, b: Choice): "p1" | "p2" | "draw" {
  if (a === b) return "draw";
  if (
    (a === "rock" && b === "scissors") ||
    (a === "paper" && b === "rock") ||
    (a === "scissors" && b === "paper")
  )
    return "p1";
  return "p2";
}

export default function RockPaperScissors() {
  const { haptic } = useTelegramWebApp();
  const [p1, setP1] = useState<Choice | null>(null);
  const [p2, setP2] = useState<Choice | null>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [round, setRound] = useState(0);

  const play = (choice: Choice) => {
    const choices: Choice[] = ["rock", "paper", "scissors"];
    const cpu = randomChoice(choices);
    setP1(choice);
    setP2(cpu);
    const w = winner(choice, cpu);
    if (w === "p1") {
      setScore((s) => ({ ...s, p1: s.p1 + 1 }));
      haptic("success");
    } else if (w === "p2") haptic("error");
    else haptic("light");
    setRound((r) => r + 1);
  };

  return (
    <GameShell gameId="rock-paper-scissors">
      <div className="text-center mb-4">
        <span className="game-chip">You {score.p1}</span>
        <span className="game-chip ml-2">CPU {score.p2}</span>
        <p className="text-xs text-[rgb(var(--game-muted))] mt-2">Round {round}</p>
      </div>
      <div className="flex justify-center gap-8 mb-6">
        <motion.div
          key={p1 ?? "?"}
          initial={{ rotate: -20, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          className="text-6xl"
        >
          {p1 ? EMOJI[p1] : "❓"}
        </motion.div>
        <span className="text-2xl self-center text-[rgb(var(--game-muted))]">vs</span>
        <motion.div
          key={p2 ?? "?"}
          initial={{ rotate: 20, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          className="text-6xl"
        >
          {p2 ? EMOJI[p2] : "❓"}
        </motion.div>
      </div>
      {p1 && p2 && (
        <p className="text-center font-semibold mb-4 text-violet-500">
          {winner(p1, p2) === "draw" ? "Draw!" : winner(p1, p2) === "p1" ? "You win!" : "CPU wins!"}
        </p>
      )}
      <div className="grid grid-cols-3 gap-3">
        {(["rock", "paper", "scissors"] as Choice[]).map((c) => (
          <button
            key={c}
            type="button"
            className="game-btn-primary !flex-col !py-6 text-3xl"
            onClick={() => play(c)}
          >
            {EMOJI[c]}
            <span className="text-xs capitalize mt-1">{c}</span>
          </button>
        ))}
      </div>
    </GameShell>
  );
}
