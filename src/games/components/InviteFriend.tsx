import { useState } from "react";
import { Copy, Share2, Users } from "lucide-react";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";

interface InviteFriendProps {
  gameTitle: string;
  roomId: string | null;
  connected: boolean;
  onCreateRoom: () => Promise<string | void>;
  onJoinRoom: (code: string) => Promise<void>;
  onLeave: () => void;
  supportsOnline?: boolean;
}

export default function InviteFriend({
  gameTitle,
  roomId,
  connected,
  onCreateRoom,
  onJoinRoom,
  onLeave,
  supportsOnline = true,
}: InviteFriendProps) {
  const { shareInvite, haptic } = useTelegramWebApp();
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!supportsOnline) return null;

  const inviteUrl =
    typeof window !== "undefined" && roomId
      ? `${window.location.origin}/games/play/${window.location.pathname.split("/").pop()}?room=${roomId}`
      : "";

  const handleShare = () => {
    if (!roomId) return;
    haptic("success");
    shareInvite(
      `Join my ${gameTitle} match on PlayVerse! Room: ${roomId}`,
      inviteUrl,
    );
  };

  const handleCopy = async () => {
    if (!roomId) return;
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    haptic("light");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="game-glass p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-[rgb(var(--game-text))]">
        <Users className="h-4 w-4 text-violet-500" />
        Play with a friend
        {connected && (
          <span className="ml-auto game-chip !text-emerald-600 !bg-emerald-500/15">
            Connected
          </span>
        )}
      </div>

      {!roomId ? (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="game-btn-primary col-span-2"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await onCreateRoom();
              setLoading(false);
            }}
          >
            Create room
          </button>
          <input
            className="col-span-2 rounded-xl border border-[rgb(var(--game-border))] bg-[rgb(var(--game-surface-2))] px-3 py-2.5 text-sm uppercase tracking-widest text-center placeholder:normal-case placeholder:tracking-normal"
            placeholder="Enter room code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
          />
          <button
            type="button"
            className="game-btn-secondary col-span-2"
            disabled={loading || joinCode.length < 4}
            onClick={async () => {
              setLoading(true);
              await onJoinRoom(joinCode);
              setLoading(false);
            }}
          >
            Join room
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-[rgb(var(--game-muted))]">
            Share this code — your friend opens the same game and taps Join.
          </p>
          <div className="flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--game-surface-2))] py-3 font-mono text-2xl font-bold tracking-[0.3em] text-violet-500">
            {roomId}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="game-btn-secondary" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button type="button" className="game-btn-primary" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Invite
            </button>
          </div>
          <button type="button" className="game-btn-ghost w-full text-xs" onClick={onLeave}>
            Leave room
          </button>
        </div>
      )}
    </div>
  );
}
