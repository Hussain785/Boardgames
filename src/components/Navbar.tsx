import { Link, NavLink } from "react-router-dom";
import { Heart, Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";

export default function Navbar() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/40 dark:bg-[#1a0814]/40 border-b border-white/40 dark:border-white/5">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="Lovelink home"
        >
          <motion.span
            initial={{ scale: 0.8, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 12 }}
            className="grid place-items-center w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 shadow-soft text-white"
          >
            <Heart className="w-5 h-5" fill="currentColor" strokeWidth={0} />
          </motion.span>
          <span className="font-display text-lg sm:text-xl font-semibold tracking-tight gradient-text">
            Lovelink
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/compose">Write a letter</NavItem>
          <NavItem to="/about">About</NavItem>
          <NavItem to="/games">PlayVerse</NavItem>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="btn-ghost !p-2.5 rounded-full"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <Link to="/compose" className="btn-primary hidden sm:inline-flex">
            <Heart className="w-4 h-4" fill="currentColor" strokeWidth={0} />
            Write a letter
          </Link>
        </div>
      </nav>
    </header>
  );
}

function NavItem({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          isActive
            ? "text-rose-700 dark:text-rose-100"
            : "text-rose-600/80 dark:text-rose-200/70 hover:text-rose-700 dark:hover:text-rose-100"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="nav-pill"
              className="absolute inset-0 -z-10 rounded-full bg-white/70 dark:bg-white/10 shadow-sm"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          {children}
        </>
      )}
    </NavLink>
  );
}
