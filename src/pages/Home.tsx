import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Heart,
  Mail,
  MessageCircle,
  Moon,
  Music,
  PenLine,
  Share2,
  Sparkles,
  Stars,
} from "lucide-react";
import FloatingHearts from "../components/FloatingHearts";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Quote />
      <FinalCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <FloatingHearts count={18} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 rounded-full border border-rose-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 px-4 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-100"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Closer than the miles between you
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mt-5 font-display text-balance text-5xl sm:text-7xl font-semibold leading-[1.05] tracking-tight"
        >
          A little home for{" "}
          <span className="font-script gradient-text font-normal whitespace-nowrap">
            love letters
          </span>{" "}
          across <br className="hidden sm:block" /> the miles.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="mx-auto mt-6 max-w-xl text-lg text-rose-800/80 dark:text-rose-100/80 text-pretty"
        >
          Write something beautiful, count the days until you're together, and
          share it as a private link only the two of you will ever open.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/compose" className="btn-primary text-base !px-6 !py-3.5">
            <PenLine className="w-4 h-4" />
            Write your letter
          </Link>
          <Link to="/about" className="btn-ghost text-base !px-5 !py-3.5">
            How it works
          </Link>
        </motion.div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.9 }}
      className="relative mx-auto mt-14 max-w-3xl"
    >
      <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-rose-200/60 via-rose-300/40 to-rose-500/20 blur-2xl" />
      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3">
        <PreviewCard
          delay={0}
          icon={<Calendar className="w-4 h-4" />}
          title="142 days"
          subtitle="until I see you again"
        />
        <PreviewCard
          delay={0.1}
          icon={<Heart className="w-4 h-4 animate-heartbeat" fill="currentColor" strokeWidth={0} />}
          title="847 days"
          subtitle="of us, and counting"
          big
        />
        <PreviewCard
          delay={0.2}
          icon={<Music className="w-4 h-4" />}
          title="Our song"
          subtitle="press play with me"
        />
      </div>
    </motion.div>
  );
}

function PreviewCard({
  icon,
  title,
  subtitle,
  big,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  big?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 + delay }}
      className={`card text-left ${
        big ? "sm:scale-105 sm:-translate-y-2 z-10" : ""
      }`}
    >
      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-200">
        {icon}
        <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">
          {subtitle}
        </span>
      </div>
      <p className="mt-2 font-display text-2xl sm:text-3xl gradient-text leading-tight">
        {title}
      </p>
    </motion.div>
  );
}

function Features() {
  const items = [
    {
      icon: <PenLine className="w-5 h-5" />,
      title: "Compose with care",
      text: "A gentle, distraction-free editor with live preview, autosave, and four hand-picked color themes.",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Count the days",
      text: "A live countdown to your reunion and a quietly growing tally of the days you've been each other's home.",
    },
    {
      icon: <Stars className="w-5 h-5" />,
      title: "Reasons you love them",
      text: "List the small, specific things — the way they laugh, the sound of their voice in the morning.",
    },
    {
      icon: <Music className="w-5 h-5" />,
      title: "Add your song",
      text: "Drop a link to the song that always finds its way back to you. They'll hear it the moment they open it.",
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: "Beautifully shareable",
      text: "Send via WhatsApp, Telegram, email, copy a link, or hand them a phone with a romantic QR code.",
    },
    {
      icon: <Moon className="w-5 h-5" />,
      title: "Day &amp; night",
      text: "A soft daylight palette, and a midnight rose for the late-night letters that mean the most.",
    },
  ];
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="label">Made for the in-betweens</p>
          <h2 className="font-display text-4xl sm:text-5xl mt-2 text-balance">
            Little touches that make distance feel{" "}
            <span className="gradient-text">smaller</span>.
          </h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05 }}
              className="card"
            >
              <div className="inline-grid place-items-center w-10 h-10 rounded-2xl text-white shadow-soft bg-gradient-to-br from-rose-400 to-rose-600">
                {it.icon}
              </div>
              <h3 className="mt-4 font-display text-xl">{it.title}</h3>
              <p
                className="mt-2 text-sm text-rose-800/80 dark:text-rose-100/80"
                dangerouslySetInnerHTML={{ __html: it.text }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: <PenLine className="w-5 h-5" />,
      title: "Write your letter",
      text: "Open the composer, pick a theme, and pour out everything you want them to know.",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Seal it with a tap",
      text: "Your letter is packed into a private link. Nothing is sent to a server.",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Send it with love",
      text: "Share via WhatsApp, Telegram, email, copy the link, or let them scan the QR.",
    },
  ];
  return (
    <section className="relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid sm:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08 }}
              className="card relative"
            >
              <span className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-white dark:bg-[#2a0c1f] grid place-items-center font-display text-rose-600 dark:text-rose-200 shadow-soft">
                {i + 1}
              </span>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-200">
                {s.icon}
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-rose-800/80 dark:text-rose-100/80">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-script text-3xl sm:text-5xl gradient-text leading-tight"
        >
          “Distance means so little when someone means so much.”
        </motion.blockquote>
        <p className="mt-3 text-sm text-rose-700/70 dark:text-rose-200/60">
          — Tom McNeal
        </p>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-12">
        <div className="card relative overflow-hidden text-center !py-12">
          <FloatingHearts count={10} />
          <h3 className="font-display text-3xl sm:text-4xl text-balance">
            Tell them tonight.
          </h3>
          <p className="mt-3 text-rose-800/80 dark:text-rose-100/80 max-w-md mx-auto">
            The miles will still be there tomorrow. But the words you write now
            will live in their pocket forever.
          </p>
          <Link to="/compose" className="btn-primary mt-6 !px-6 !py-3.5">
            <Heart className="w-4 h-4" fill="currentColor" strokeWidth={0} />
            Start your letter
          </Link>
        </div>
      </div>
    </section>
  );
}
