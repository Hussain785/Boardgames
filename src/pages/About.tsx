import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Heart,
  Lock,
  Music,
  PenLine,
  Share2,
  Smartphone,
  Sparkles,
  Stars,
} from "lucide-react";
import FloatingHearts from "../components/FloatingHearts";

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden">
        <FloatingHearts count={10} />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="label">About Lovelink</p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl sm:text-6xl mt-2 text-balance"
          >
            Built quietly, for the loves who{" "}
            <span className="gradient-text">live in two time zones</span>.
          </motion.h1>
          <p className="mt-5 text-rose-800/80 dark:text-rose-100/80 text-pretty">
            Lovelink is a small, private place to write a letter and send it
            beautifully. No accounts. No databases. Just words, a heartbeat,
            and a link only the two of you will ever open.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card
            icon={<Lock className="w-5 h-5" />}
            title="Private by design"
            text="Your letter is encoded directly into the share link. Nothing is sent to a server, nothing is stored online. Delete the link, delete the letter."
          />
          <Card
            icon={<Sparkles className="w-5 h-5" />}
            title="Made to feel beautiful"
            text="Soft gradients, gentle animations, four hand-picked themes, and a midnight mode for the late letters."
          />
          <Card
            icon={<Calendar className="w-5 h-5" />}
            title="Counts that matter"
            text="A live countdown to your reunion, plus a tally of every day you've been each other's home."
          />
          <Card
            icon={<Stars className="w-5 h-5" />}
            title="Reasons + your song"
            text="A list of small specific reasons. A link to the song that always means you. The little touches that make distance feel smaller."
          />
          <Card
            icon={<Smartphone className="w-5 h-5" />}
            title="Works on any device"
            text="Responsive on phones, tablets and laptops. A QR code is included in case you'd rather hand them your phone in person."
          />
          <Card
            icon={<Share2 className="w-5 h-5" />}
            title="Share how you like"
            text="WhatsApp, Telegram, email, copy link, or use your device's native share sheet. The letter goes wherever they are."
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-balance">
          Three little tips before you write.
        </h2>
        <ol className="mt-8 grid sm:grid-cols-3 gap-4 text-left">
          <Tip
            n={1}
            title="Be specific"
            text="The way they sip coffee. The sound right before they laugh. Specifics feel more like love than grand declarations."
          />
          <Tip
            n={2}
            title="Write at night"
            text="The world is quieter, and so is your filter. The most honest letters happen after midnight."
          />
          <Tip
            n={3}
            title="Don't overthink"
            text="They love how you talk. So talk. Send it before you talk yourself out of how much you mean it."
          />
        </ol>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/compose" className="btn-primary !px-6 !py-3.5">
            <PenLine className="w-4 h-4" />
            Start a letter
          </Link>
          <Link to="/" className="btn-ghost !px-5 !py-3.5">
            <Heart className="w-4 h-4" fill="currentColor" strokeWidth={0} />
            Back to home
          </Link>
        </div>
      </section>
    </>
  );
}

function Card({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="card"
    >
      <div className="inline-grid place-items-center w-10 h-10 rounded-2xl text-white shadow-soft bg-gradient-to-br from-rose-400 to-rose-600">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-xl">{title}</h3>
      <p className="mt-2 text-sm text-rose-800/80 dark:text-rose-100/80">
        {text}
      </p>
    </motion.div>
  );
}

function Tip({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <li className="card relative">
      <span className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-white dark:bg-[#2a0c1f] grid place-items-center font-display text-rose-600 dark:text-rose-200 shadow-soft">
        {n}
      </span>
      <h3 className="font-display text-xl mt-1">{title}</h3>
      <p className="mt-2 text-sm text-rose-800/80 dark:text-rose-100/80">
        {text}
      </p>
    </li>
  );
}

// keep Music import used (for dead-code lint friendliness in some setups)
void Music;
