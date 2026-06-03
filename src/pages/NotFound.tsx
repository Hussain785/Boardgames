import { Link } from "react-router-dom";
import { ArrowLeft, HeartCrack } from "lucide-react";
import FloatingHearts from "../components/FloatingHearts";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <FloatingHearts count={8} />
      <div className="relative mx-auto max-w-xl px-4 sm:px-6 py-24 text-center">
        <div className="inline-grid place-items-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 text-white shadow-soft">
          <HeartCrack className="w-8 h-8" />
        </div>
        <h1 className="mt-5 font-display text-5xl gradient-text">
          Lost in the post.
        </h1>
        <p className="mt-3 text-rose-800/80 dark:text-rose-100/80">
          We couldn't find that page. But there's still a love letter waiting
          to be written.
        </p>
        <Link to="/" className="btn-primary mt-8">
          <ArrowLeft className="w-4 h-4" />
          Back home
        </Link>
      </div>
    </section>
  );
}
