// Compact, URL-safe encoding of letter data.
// We avoid a backend by stuffing the payload into a hash fragment so it
// never hits any server logs and stays private between you and your love.

export interface LetterData {
  /** "to" recipient name */
  to: string;
  /** "from" sender name */
  from: string;
  /** Title / opening line, e.g. "My dearest" */
  title: string;
  /** The body of the letter (can include line breaks) */
  body: string;
  /** A small closing line, e.g. "Forever yours" */
  closing: string;
  /** Optional ISO date for the day they will reunite */
  reunionDate?: string;
  /** Optional ISO date for the day they started dating */
  sinceDate?: string;
  /** Optional list of "reasons I love you" */
  reasons?: string[];
  /** Optional song to accompany the letter (YouTube / Spotify / SoundCloud URL) */
  songUrl?: string;
  /** Optional accent theme */
  accent?: "rose" | "sunset" | "lavender" | "ocean";
  /** Letter creation date (ISO) */
  createdAt?: string;
}

export const ACCENTS = {
  rose: {
    name: "Rose",
    from: "#ff6b9c",
    to: "#e62168",
    soft: "#ffe4ec",
  },
  sunset: {
    name: "Sunset",
    from: "#ffb38a",
    to: "#ff6b6b",
    soft: "#ffe6dc",
  },
  lavender: {
    name: "Lavender",
    from: "#c8a2ff",
    to: "#7b5dfa",
    soft: "#ece1ff",
  },
  ocean: {
    name: "Ocean",
    from: "#7ed0ff",
    to: "#3a8dde",
    soft: "#dff1ff",
  },
} as const;

export type AccentKey = keyof typeof ACCENTS;

// ---- Encoding ---------------------------------------------------------------

function toBase64Url(input: string): string {
  // Convert UTF-8 string -> base64 -> URL-safe
  const utf8 = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < utf8.length; i++) binary += String.fromCharCode(utf8[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input: string): string {
  let b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  // Pad to a multiple of 4
  while (b64.length % 4 !== 0) b64 += "=";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeLetter(data: LetterData): string {
  // Strip empty optionals to keep the URL short & tidy.
  const compact: Partial<LetterData> = { ...data };
  (Object.keys(compact) as (keyof LetterData)[]).forEach((k) => {
    const v = compact[k];
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) {
      delete compact[k];
    }
  });
  return toBase64Url(JSON.stringify(compact));
}

export function decodeLetter(token: string): LetterData | null {
  try {
    const json = fromBase64Url(token);
    const parsed = JSON.parse(json) as Partial<LetterData>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      to: typeof parsed.to === "string" ? parsed.to : "",
      from: typeof parsed.from === "string" ? parsed.from : "",
      title: typeof parsed.title === "string" ? parsed.title : "My dearest",
      body: typeof parsed.body === "string" ? parsed.body : "",
      closing:
        typeof parsed.closing === "string" ? parsed.closing : "Forever yours",
      reunionDate:
        typeof parsed.reunionDate === "string" ? parsed.reunionDate : undefined,
      sinceDate:
        typeof parsed.sinceDate === "string" ? parsed.sinceDate : undefined,
      reasons: Array.isArray(parsed.reasons)
        ? parsed.reasons.filter((r): r is string => typeof r === "string")
        : undefined,
      songUrl: typeof parsed.songUrl === "string" ? parsed.songUrl : undefined,
      accent:
        parsed.accent && parsed.accent in ACCENTS ? parsed.accent : "rose",
      createdAt:
        typeof parsed.createdAt === "string" ? parsed.createdAt : undefined,
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(data: LetterData): string {
  const token = encodeLetter(data);
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname.replace(/\/+$/, "")}`
      : "";
  return `${base}/letter#${token}`;
}

// ---- Drafts (local autosave) -----------------------------------------------

const DRAFT_KEY = "lovelink:draft";

export function saveDraft(data: LetterData) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function loadDraft(): LetterData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LetterData;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

// ---- Helpers ---------------------------------------------------------------

export function daysBetween(aIso?: string, bIso?: string): number | null {
  if (!aIso) return null;
  const a = new Date(aIso);
  const b = bIso ? new Date(bIso) : new Date();
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / 86_400_000);
}

export function defaultLetter(): LetterData {
  return {
    to: "",
    from: "",
    title: "My dearest",
    body:
      "Even with all these miles between us, you are the first thought I wake up with and the last whisper before I sleep. You make distance feel like nothing more than a beautiful pause before the next time we meet.",
    closing: "Forever yours",
    reasons: [
      "The way you laugh at your own jokes",
      "How safe I feel when we talk for hours",
      "Your kindness, even on hard days",
    ],
    accent: "rose",
    createdAt: new Date().toISOString(),
  };
}
