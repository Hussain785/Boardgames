export type GameCategory =
  | "classic"
  | "board"
  | "arcade"
  | "party"
  | "puzzle";

export type MultiplayerMode = "local" | "online" | "both";

export interface GameMeta {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  category: GameCategory;
  gradient: string;
  multiplayer: MultiplayerMode;
  tags: string[];
  popular?: boolean;
}

export interface MultiplayerState<T = unknown> {
  roomId: string | null;
  isHost: boolean;
  connected: boolean;
  peerName: string;
  gameState: T | null;
}
