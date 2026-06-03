// Quick smoke test for the URL-safe base64 encoding used by the letter
// payload. Mirrors src/lib/letter.ts so we can verify a roundtrip works
// with realistic data, including emoji and non-ASCII characters.

function toBase64Url(input) {
  const utf8 = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < utf8.length; i++) binary += String.fromCharCode(utf8[i]);
  const b64 = Buffer.from(binary, "binary").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input) {
  let b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) b64 += "=";
  const binary = Buffer.from(b64, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

const data = {
  to: "Élise",
  from: "你好",
  title: "My dearest",
  body: "Hello — distance can't reach what we have. I love you 💖",
  closing: "Forever yours",
  reasons: ["The way you laugh", "Your handwriting"],
  reunionDate: "2026-12-25",
  sinceDate: "2024-02-14",
  accent: "rose",
  songUrl: "https://open.spotify.com/track/abc",
  createdAt: new Date().toISOString(),
};

const token = toBase64Url(JSON.stringify(data));
const decoded = JSON.parse(fromBase64Url(token));

let ok = true;
for (const k of Object.keys(data)) {
  if (JSON.stringify(decoded[k]) !== JSON.stringify(data[k])) {
    console.error("Mismatch on", k, decoded[k], data[k]);
    ok = false;
  }
}

console.log("token length:", token.length);
console.log("roundtrip:", ok ? "PASS" : "FAIL");
console.log("preview:", token.slice(0, 80) + (token.length > 80 ? "..." : ""));

if (!ok) process.exit(1);
