import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import GamesLayout from "./components/GamesLayout";
import Hub from "./pages/Hub";

const TicTacToe = lazy(() => import("./games/TicTacToe"));
const ChessGame = lazy(() => import("./games/ChessGame"));
const LudoGame = lazy(() => import("./games/LudoGame"));
const SnakesAndLadders = lazy(() => import("./games/SnakesAndLadders"));
const TruthOrDare = lazy(() => import("./games/TruthOrDare"));
const SnakeGame = lazy(() => import("./games/SnakeGame"));
const PacMan = lazy(() => import("./games/PacMan"));
const SkyRunner = lazy(() => import("./games/SkyRunner"));
const CarromGame = lazy(() => import("./games/CarromGame"));
const ConnectFour = lazy(() => import("./games/ConnectFour"));
const MemoryMatch = lazy(() => import("./games/MemoryMatch"));
const Game2048 = lazy(() => import("./games/Game2048"));
const RockPaperScissors = lazy(() => import("./games/RockPaperScissors"));
const BrickBreaker = lazy(() => import("./games/BrickBreaker"));
const CheckersGame = lazy(() => import("./games/CheckersGame"));

function GameLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
    </div>
  );
}

const GAME_ROUTES: Record<string, React.ComponentType> = {
  "tic-tac-toe": TicTacToe,
  chess: ChessGame,
  ludo: LudoGame,
  "snakes-ladders": SnakesAndLadders,
  "truth-or-dare": TruthOrDare,
  snake: SnakeGame,
  "pac-man": PacMan,
  runner: SkyRunner,
  carrom: CarromGame,
  "connect-four": ConnectFour,
  memory: MemoryMatch,
  "game-2048": Game2048,
  "rock-paper-scissors": RockPaperScissors,
  "brick-breaker": BrickBreaker,
  checkers: CheckersGame,
};

function DynamicGame() {
  const { gameId } = useParams<{ gameId: string }>();
  const Game = gameId ? GAME_ROUTES[gameId] : undefined;
  if (!Game) return <Navigate to="/games" replace />;
  return <Game />;
}

export default function GamesApp() {
  return (
    <Routes>
      <Route element={<GamesLayout />}>
        <Route index element={<Hub />} />
        <Route
          path="play/:gameId"
          element={
            <Suspense fallback={<GameLoader />}>
              <DynamicGame />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
