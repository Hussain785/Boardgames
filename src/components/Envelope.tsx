import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface EnvelopeProps {
  to: string;
  from: string;
  onOpen: () => void;
}

/**
 * Animated 3D-feeling envelope. Click → flap opens → letter rises out.
 * The actual letter content is rendered by the parent, this is purely the
 * intro reveal.
 */
export default function Envelope({ to, from, onOpen }: EnvelopeProps) {
  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={`Open the letter from ${from || "your love"}`}
        className="relative block w-full aspect-[5/3.4] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-300/60 rounded-2xl"
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -6, rotateX: -4, rotateY: 2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        style={{ transformStyle: "preserve-3d", perspective: 900 }}
      >
        <div
          className="absolute inset-0 rounded-2xl shadow-soft overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #ff8ab2 0%, #ff5d8f 55%, #d61f5d 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 6px, transparent 6px 16px)",
            }}
          />
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 100%, 50% 35%, 100% 100%)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.08))",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[55%]"
              style={{
                clipPath: "polygon(0 0, 50% 70%, 100% 0, 100% 100%, 0 100%)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.18))",
              }}
            />
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          className="absolute -top-1 left-0 right-0 origin-top"
          initial={{ rotateX: 0 }}
          whileHover={{ rotateX: -18 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          style={{
            transformStyle: "preserve-3d",
            height: "60%",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              background:
                "linear-gradient(180deg, #ff9bbd 0%, #ff6f9c 60%, #e62168 100%)",
              boxShadow: "0 6px 18px -4px rgba(0,0,0,0.25)",
            }}
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 grid place-items-center w-14 h-14 rounded-full text-white shadow-lg"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #ff95b4, #c81353 70%)",
          }}
        >
          <Heart
            className="w-7 h-7 animate-heartbeat"
            fill="currentColor"
            strokeWidth={0}
          />
        </div>

        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs font-medium z-0">
          <span className="truncate max-w-[55%]">
            <span className="opacity-70 mr-1">to</span>
            <strong className="font-semibold tracking-wide">
              {to || "you"}
            </strong>
          </span>
          <span className="truncate max-w-[40%] text-right">
            <span className="opacity-70 mr-1">from</span>
            <strong className="font-semibold tracking-wide">
              {from || "me"}
            </strong>
          </span>
        </div>
      </motion.button>

      <motion.p
        className="mt-6 text-center text-sm text-rose-700/80 dark:text-rose-200/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Tap the envelope to open your letter
      </motion.p>
    </div>
  );
}
