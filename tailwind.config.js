/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "ui-serif", "Georgia", "serif"],
        script: ['"Dancing Script"', '"Great Vibes"', "cursive"],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      colors: {
        rose: {
          50: "#fff5f7",
          100: "#ffe4ec",
          200: "#ffc6d8",
          300: "#ff9bbb",
          400: "#ff6b9c",
          500: "#ff3d7f",
          600: "#e62168",
          700: "#bf1554",
          800: "#8a0e3d",
          900: "#5c082a",
        },
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(255, 61, 127, 0.35)",
        glow: "0 0 60px rgba(255, 107, 156, 0.45)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-medium": "float 6s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "heartbeat": "heartbeat 1.4s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "fade-up": "fadeUp 0.8s ease-out both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(6deg)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "15%": { transform: "scale(1.18)" },
          "30%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.12)" },
          "60%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "romantic-gradient":
          "radial-gradient(at 20% 20%, #ffd1e0 0px, transparent 50%), radial-gradient(at 80% 0%, #ffb3d1 0px, transparent 50%), radial-gradient(at 0% 100%, #ffe4ec 0px, transparent 50%), radial-gradient(at 80% 100%, #ffc6d8 0px, transparent 50%)",
        "romantic-dark":
          "radial-gradient(at 20% 20%, #4a1a32 0px, transparent 50%), radial-gradient(at 80% 0%, #3a1028 0px, transparent 50%), radial-gradient(at 0% 100%, #1a0814 0px, transparent 50%), radial-gradient(at 80% 100%, #2a0c1f 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};
