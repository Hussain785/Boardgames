import { useCallback, useEffect, useRef, useState } from "react";
import { PeerRoom, generateRoomId } from "../lib/peerMultiplayer";

export function useMultiplayer<T extends object>() {
  const roomRef = useRef<PeerRoom | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [connected, setConnected] = useState(false);
  const [remoteState, setRemoteState] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    roomRef.current?.destroy();
    roomRef.current = null;
    setConnected(false);
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const createRoom = useCallback(async () => {
    cleanup();
    setError(null);
    const id = generateRoomId();
    setRoomId(id);
    setIsHost(true);
    setRemoteState(null);

    const room = new PeerRoom(id, true);
    roomRef.current = room;

    try {
      await room.connect(
        (data) => setRemoteState(data as T),
        (c) => setConnected(c),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to host room");
    }
    return id;
  }, [cleanup]);

  const joinRoom = useCallback(
    async (id: string) => {
      cleanup();
      setError(null);
      const code = id.trim().toUpperCase();
      setRoomId(code);
      setIsHost(false);
      setRemoteState(null);

      const room = new PeerRoom(code, false);
      roomRef.current = room;

      try {
        await room.connect(
          (data) => setRemoteState(data as T),
          (c) => setConnected(c),
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to join room");
      }
    },
    [cleanup],
  );

  const sendState = useCallback((state: T) => {
    roomRef.current?.send(state);
  }, []);

  const leaveRoom = useCallback(() => {
    cleanup();
    setRoomId(null);
    setIsHost(false);
    setRemoteState(null);
    setError(null);
  }, [cleanup]);

  return {
    roomId,
    isHost,
    connected,
    remoteState,
    error,
    createRoom,
    joinRoom,
    sendState,
    leaveRoom,
  };
}
