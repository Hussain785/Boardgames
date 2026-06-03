import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, PenLine, Share2 } from "lucide-react";
import LetterPaper from "../components/LetterPaper";
import Envelope from "../components/Envelope";
import FloatingHearts from "../components/FloatingHearts";
import ShareDialog from "../components/ShareDialog";
import { decodeLetter, type LetterData } from "../lib/letter";

export default function Letter() {
  const location = useLocation();
  const token = useMemo(() => {
    // The letter payload lives in the hash fragment for privacy.
    const hash = location.hash.replace(/^#/, "");
    return hash || "";
  }, [location.hash]);

  const data = useMemo<LetterData | null>(
    () => (token ? decodeLetter(token) : null),
    [token]
  );

  if (!data) {
    return <NoLetter hasToken={!!token} />;
  }

  // Keying on the token resets all internal state when a new letter is
  // navigated to (e.g. via in-app routing). This avoids needing an effect
  // that synchronously calls setState.
  return <LetterView key={token} data={data} token={token} />;
}

function LetterView({ data, token }: { data: LetterData; token: string }) {
  const [opened, setOpened] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}#${token}`
      : "";

  return (
    <section className="relative overflow-hidden">
      <FloatingHearts count={opened ? 22 : 12} />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="envelope"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="label">A letter has arrived</p>
              <h1 className="font-display text-4xl sm:text-5xl mt-2 text-balance">
                There's something{" "}
                <span className="gradient-text">just for you</span>.
              </h1>
              <p className="mt-3 text-rose-800/80 dark:text-rose-100/80">
                {data.from
                  ? `${data.from} wrote you a letter.`
                  : "Someone who loves you wrote this."}{" "}
                Take a breath. Then open it.
              </p>
              <div className="mt-10">
                <Envelope
                  to={data.to}
                  from={data.from}
                  onOpen={() => setOpened(true)}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <LetterPaper data={data} />

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShareOpen(true)}
                  className="btn-outline"
                >
                  <Share2 className="w-4 h-4" />
                  Forward this letter
                </button>
                <Link to="/compose" className="btn-primary">
                  <PenLine className="w-4 h-4" />
                  Write one back
                </Link>
              </div>
              <p className="mt-6 text-center text-xs text-rose-500/80 dark:text-rose-200/60">
                Saved with love. Keep this link — open it anytime you miss them.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={fullUrl}
        recipientName={data.to}
        senderName={data.from}
      />
    </section>
  );
}

function NoLetter({ hasToken }: { hasToken: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <FloatingHearts count={10} />
      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <div className="inline-grid place-items-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 text-white shadow-soft">
          <Heart className="w-8 h-8" fill="currentColor" strokeWidth={0} />
        </div>
        <h1 className="mt-5 font-display text-4xl sm:text-5xl">
          {hasToken ? "This letter looks scrambled." : "No letter to open yet."}
        </h1>
        <p className="mt-3 text-rose-800/80 dark:text-rose-100/80">
          {hasToken
            ? "The link may have been copied incomplete. Try asking your love to send it again."
            : "Letters are opened from a private link. Write one and share it with someone who deserves to feel adored."}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/compose" className="btn-primary">
            <PenLine className="w-4 h-4" />
            Write a letter
          </Link>
          <Link to="/" className="btn-ghost">
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
