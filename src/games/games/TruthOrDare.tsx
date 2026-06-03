import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameShell from "../components/GameShell";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

const TRUTHS = [
  "What's your most embarrassing moment?",
  "Who was your first crush?",
  "What's a secret talent nobody knows?",
  "What's the kindest thing someone did for you?",
  "If you could relive one day, which would it be?",
  "What's your guilty pleasure song?",
  "What's the bravest thing you've ever done?",
  "What dream are you chasing right now?",
];

const DARES = [
  "Send a voice note saying something sweet.",
  "Do your best dance move for 10 seconds.",
  "Text someone 'thinking of you' right now.",
  "Speak in an accent for the next 2 rounds.",
  "Share your lock screen (if comfortable).",
  "Hum a song until someone guesses it.",
  "Compliment the other player sincerely.",
  "Take a silly selfie together (or solo).",
];

export default function TruthOrDare() {
  const { haptic } = useTelegramWebApp();
  const [card, setCard] = useState<{ type: "truth" | "dare"; text: string } | null>(null);
  const [spinning, setSpinning] = useState(false);

  const draw = (type: "truth" | "dare") => {
    setSpinning(true);
    haptic("light");
    setTimeout(() => {
      const pool = type === "truth" ? TRUTHS : DARES;
      setCard({ type, text: pool[Math.floor(Math.random() * pool.length)]! });
      setSpinning(false);
      haptic("success");
    }, 600);
  };

  return (
    <GameShell gameId="truth-or-dare">
      <div className="game-glass p-6 min-h-[280px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {card && !spinning ? (
            <motion.div
              key={card.text}
              initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <span
                className={`game-chip mb-4 ${card.type === "dare" ? "!bg-rose-500/15 !text-rose-500" : ""}`}
              >
                {card.type}
              </span>
              <p className="text-lg font-medium text-[rgb(var(--game-text))] leading-relaxed px-2">
                {card.text}
              </p>
            </motion.div>
          ) : (
            <motion.p
              animate={{ opacity: spinning ? 0.5 : 1 }}
              className="text-[rgb(var(--game-muted))] text-sm"
            >
              {spinning ? "Drawing card…" : "Pick Truth or Dare"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          type="button"
          className="game-btn-primary !py-4 bg-gradient-to-r from-violet-500 to-indigo-500"
          onClick={() => draw("truth")}
          disabled={spinning}
        >
          Truth
        </button>
        <button
          type="button"
          className="game-btn-primary !py-4 !from-rose-500 !to-pink-600"
          onClick={() => draw("dare")}
          disabled={spinning}
        >
          Dare
        </button>
      </div>
    </GameShell>
  );
}
