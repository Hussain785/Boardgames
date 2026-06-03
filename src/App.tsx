import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Compose from "./pages/Compose";
import Letter from "./pages/Letter";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const GamesApp = lazy(() => import("./games/GamesApp"));

export default function App() {
  return (
    <Routes>
      <Route
        path="/games/*"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading PlayVerse…
              </div>
            }
          >
            <GamesApp />
          </Suspense>
        }
      />
      <Route
        path="/*"
        element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/compose" element={<Compose />} />
                <Route path="/letter" element={<Letter />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}
