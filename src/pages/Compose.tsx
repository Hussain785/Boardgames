import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Eye,
  EyeOff,
  Heart,
  Music,
  PenLine,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import LetterPaper from "../components/LetterPaper";
import ShareDialog from "../components/ShareDialog";
import {
  ACCENTS,
  buildShareUrl,
  clearDraft,
  defaultLetter,
  loadDraft,
  saveDraft,
  type AccentKey,
  type LetterData,
} from "../lib/letter";

const SUGGESTIONS = [
  "Tonight, I caught myself smiling at nothing — turns out it was the thought of you.",
  "Some nights the distance is loud. Tonight it's just a soft hum because I know you're mine.",
  "I want to memorize the way you say my name and play it back on the days I miss you most.",
  "If love had a sound, it would be the way your voice gets quiet right before you say goodnight.",
  "I keep falling for you in small ways — over text, over time, over and over again.",
];

const TITLE_SUGGESTIONS = [
  "My dearest",
  "To my favorite person",
  "My love",
  "Hi sunshine",
  "Sweet you",
];

const CLOSING_SUGGESTIONS = [
  "Forever yours",
  "Yours, across every mile",
  "All my love",
  "Until I'm in your arms",
  "Your favorite hello",
];

export default function Compose() {
  const [data, setData] = useState<LetterData>(() => {
    return loadDraft() ?? defaultLetter();
  });
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const isFirstRender = useRef(true);

  // Autosave (debounced)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const id = window.setTimeout(() => saveDraft(data), 350);
    return () => window.clearTimeout(id);
  }, [data]);

  const update = <K extends keyof LetterData>(key: K, value: LetterData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const reasons = data.reasons ?? [];
  const setReasons = (next: string[]) => update("reasons", next);

  const shareUrl = useMemo(() => buildShareUrl(data), [data]);
  const canShare = data.body.trim().length > 0;

  const handleSurprise = () => {
    const t = TITLE_SUGGESTIONS[Math.floor(Math.random() * TITLE_SUGGESTIONS.length)];
    const c = CLOSING_SUGGESTIONS[Math.floor(Math.random() * CLOSING_SUGGESTIONS.length)];
    setData((d) => ({
      ...d,
      title: t,
      closing: c,
      body:
        d.body.trim().length === 0
          ? defaultLetter().body
          : d.body,
    }));
  };

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <header className="text-center max-w-2xl mx-auto">
          <p className="label">Write your letter</p>
          <h1 className="font-display text-4xl sm:text-5xl mt-2 text-balance">
            Pour your heart out, then{" "}
            <span className="gradient-text">send it across the miles</span>.
          </h1>
          <p className="mt-3 text-rose-800/80 dark:text-rose-100/80">
            Everything you type stays only in your browser until you choose to
            share. Take your time — they're worth it.
          </p>
        </header>

        <div className="mt-10 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-8 items-start">
          {/* FORM */}
          <div className="card !p-5 sm:!p-7 space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-200">
                <PenLine className="w-4 h-4" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold">
                  Compose
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSurprise}
                  className="btn-ghost !py-2 !px-3 text-sm"
                  title="Try a romantic suggestion"
                >
                  <Wand2 className="w-4 h-4" />
                  Surprise me
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreviewMobile((v) => !v)}
                  className="btn-ghost !py-2 !px-3 text-sm lg:hidden"
                >
                  {showPreviewMobile ? (
                    <>
                      <EyeOff className="w-4 h-4" /> Hide preview
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" /> Preview
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="To"
                hint="Their name or pet name"
              >
                <input
                  className="input"
                  placeholder="e.g. Mia"
                  value={data.to}
                  onChange={(e) => update("to", e.target.value)}
                  maxLength={60}
                />
              </Field>
              <Field label="From" hint="What they call you">
                <input
                  className="input"
                  placeholder="e.g. Alex"
                  value={data.from}
                  onChange={(e) => update("from", e.target.value)}
                  maxLength={60}
                />
              </Field>
            </div>

            <Field
              label="Opening"
              hint="A soft beginning, like the first words of a song"
            >
              <input
                className="input"
                placeholder="My dearest"
                value={data.title}
                onChange={(e) => update("title", e.target.value)}
                maxLength={80}
              />
              <SuggestionRow
                onPick={(v) => update("title", v)}
                suggestions={TITLE_SUGGESTIONS}
              />
            </Field>

            <Field
              label="The letter"
              hint={`${data.body.length} characters · separate paragraphs with a blank line`}
            >
              <textarea
                className="input min-h-[220px] font-display text-[16px] leading-relaxed"
                placeholder="Tell them everything. The little things, the big things. The way they make ordinary days feel like a celebration."
                value={data.body}
                onChange={(e) => update("body", e.target.value)}
                maxLength={4000}
              />
              <SuggestionRow
                onPick={(v) =>
                  setData((d) => ({
                    ...d,
                    body: d.body
                      ? d.body.replace(/\s*$/, "\n\n") + v
                      : v,
                  }))
                }
                suggestions={SUGGESTIONS}
                short
              />
            </Field>

            <Field
              label="Closing"
              hint="The last warm thing they'll read"
            >
              <input
                className="input"
                placeholder="Forever yours"
                value={data.closing}
                onChange={(e) => update("closing", e.target.value)}
                maxLength={60}
              />
              <SuggestionRow
                onPick={(v) => update("closing", v)}
                suggestions={CLOSING_SUGGESTIONS}
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="When you'll meet again"
                hint="Adds a live countdown to your letter"
              >
                <div className="relative">
                  <input
                    type="date"
                    className="input"
                    value={data.reunionDate ?? ""}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => update("reunionDate", e.target.value || undefined)}
                  />
                  <Calendar className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-rose-400" />
                </div>
              </Field>
              <Field
                label="Together since"
                hint="Adds a 'days of us' counter"
              >
                <div className="relative">
                  <input
                    type="date"
                    className="input"
                    value={data.sinceDate ?? ""}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => update("sinceDate", e.target.value || undefined)}
                  />
                  <Heart
                    className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-rose-400"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </div>
              </Field>
            </div>

            <Field
              label="Our song"
              hint="A YouTube, Spotify, or any music link"
            >
              <div className="relative">
                <input
                  className="input pl-10"
                  type="url"
                  placeholder="https://open.spotify.com/track/..."
                  value={data.songUrl ?? ""}
                  onChange={(e) => update("songUrl", e.target.value || undefined)}
                />
                <Music className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-rose-400" />
              </div>
            </Field>

            <ReasonsEditor reasons={reasons} setReasons={setReasons} />

            <Field label="Color of your love" hint="Pick a theme">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(ACCENTS) as AccentKey[]).map((k) => {
                  const a = ACCENTS[k];
                  const active = (data.accent ?? "rose") === k;
                  return (
                    <button
                      type="button"
                      key={k}
                      onClick={() => update("accent", k)}
                      className={`group relative rounded-2xl px-3 py-2 flex items-center gap-2 border transition ${
                        active
                          ? "border-rose-500 ring-2 ring-rose-300/60"
                          : "border-white/60 dark:border-white/10 hover:border-rose-300"
                      } bg-white/60 dark:bg-white/5`}
                      aria-pressed={active}
                    >
                      <span
                        className="w-5 h-5 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
                        }}
                      />
                      <span className="text-sm font-medium">{a.name}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                disabled={!canShare}
                onClick={() => setShareOpen(true)}
                className="btn-primary !py-3.5 flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <Send className="w-4 h-4" />
                Send it with love
              </button>
              <Link
                to={`/letter#${shareUrl.split("#")[1] ?? ""}`}
                className="btn-outline !py-3.5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Sparkles className="w-4 h-4" />
                Open in a new tab
              </Link>
              <button
                type="button"
                className="btn-ghost !py-3.5"
                onClick={() => {
                  if (confirm("Clear the entire draft? This cannot be undone.")) {
                    clearDraft();
                    setData(defaultLetter());
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
                Reset
              </button>
            </div>
            <p className="text-[11px] text-rose-500/80 dark:text-rose-200/60 -mt-2">
              Your draft autosaves to this browser. Nothing is uploaded.
            </p>
          </div>

          {/* PREVIEW */}
          <div
            className={`${
              showPreviewMobile ? "block" : "hidden lg:block"
            } sticky top-20`}
          >
            <p className="label flex items-center gap-2 justify-center lg:justify-start">
              <Eye className="w-3.5 h-3.5" /> Live preview
            </p>
            <motion.div
              key={(data.accent ?? "rose") + data.title.length + data.body.length}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <LetterPaper data={data} preview />
            </motion.div>
          </div>
        </div>
      </div>

      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={shareUrl}
        recipientName={data.to}
        senderName={data.from}
      />
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && (
        <p className="mt-1.5 text-[11px] text-rose-500/80 dark:text-rose-200/60">
          {hint}
        </p>
      )}
    </div>
  );
}

function SuggestionRow({
  suggestions,
  onPick,
  short,
}: {
  suggestions: string[];
  onPick: (v: string) => void;
  short?: boolean;
}) {
  return (
    <div className="mt-2 -mx-1 flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {suggestions.map((s, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(s)}
          className="shrink-0 max-w-[260px] rounded-full border border-rose-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-rose-100/70 dark:hover:bg-white/10 px-3 py-1.5 text-xs text-rose-700 dark:text-rose-100 truncate transition"
          title={s}
        >
          {short ? `“${s.slice(0, 48)}${s.length > 48 ? "…" : ""}”` : s}
        </button>
      ))}
    </div>
  );
}

function ReasonsEditor({
  reasons,
  setReasons,
}: {
  reasons: string[];
  setReasons: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (reasons.length >= 12) return;
    setReasons([...reasons, v]);
    setDraft("");
  };

  return (
    <div>
      <label className="label">Reasons I love you</label>
      <p className="mb-2 text-[11px] text-rose-500/80 dark:text-rose-200/60">
        Up to 12 little, specific things. The smaller, the better.
      </p>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="The way you laugh at your own jokes"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          maxLength={120}
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim() || reasons.length >= 12}
          className="btn-primary !px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add reason"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {reasons.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {reasons.map((r, i) => (
            <li
              key={`${r}-${i}`}
              className="group inline-flex items-center gap-2 rounded-full border border-rose-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1.5 text-sm"
            >
              <Heart
                className="w-3 h-3 text-rose-500"
                fill="currentColor"
                strokeWidth={0}
              />
              <span className="max-w-[280px] truncate" title={r}>
                {r}
              </span>
              <button
                type="button"
                aria-label={`Remove "${r}"`}
                className="opacity-60 hover:opacity-100"
                onClick={() =>
                  setReasons(reasons.filter((_, idx) => idx !== i))
                }
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
