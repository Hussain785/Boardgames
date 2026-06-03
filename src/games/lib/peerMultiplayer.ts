import Peer, { type DataConnection } from "peerjs";

const ROOM_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRoomId(length = 6): string {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += ROOM_CHARS[Math.floor(Math.random() * ROOM_CHARS.length)];
  }
  return id;
}

type MessageHandler = (data: unknown) => void;
type ConnectionHandler = (connected: boolean) => void;

export class PeerRoom {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private onMessage: MessageHandler = () => {};
  private onConnection: ConnectionHandler = () => {};
  private readonly roomId: string;
  private readonly isHost: boolean;

  constructor(roomId: string, isHost: boolean) {
    this.roomId = roomId;
    this.isHost = isHost;
  }

  async connect(
    onMessage: MessageHandler,
    onConnection: ConnectionHandler,
  ): Promise<void> {
    this.onMessage = onMessage;
    this.onConnection = onConnection;

    const peerId = this.isHost ? `play-${this.roomId}` : undefined;

    this.peer = peerId
      ? new Peer(peerId, { debug: 0 })
      : new Peer({ debug: 0 });

    await new Promise<void>((resolve, reject) => {
      if (!this.peer) return reject(new Error("Peer init failed"));
      const timeout = setTimeout(() => reject(new Error("Connection timeout")), 15000);
      this.peer.on("open", () => {
        clearTimeout(timeout);
        resolve();
      });
      this.peer.on("error", (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    if (this.isHost) {
      this.peer.on("connection", (connection) => {
        this.attachConnection(connection);
      });
      this.onConnection(false);
    } else {
      await new Promise((r) => setTimeout(r, 400));
      const hostId = `play-${this.roomId}`;
      const connection = this.peer.connect(hostId, { reliable: true });
      this.attachConnection(connection);
    }
  }

  private attachConnection(connection: DataConnection) {
    if (this.conn?.open) this.conn.close();
    this.conn = connection;

    connection.on("open", () => {
      this.onConnection(true);
    });

    connection.on("data", (data) => {
      this.onMessage(data);
    });

    connection.on("close", () => {
      this.onConnection(false);
    });

    connection.on("error", () => {
      this.onConnection(false);
    });
  }

  send(data: unknown) {
    if (this.conn?.open) {
      this.conn.send(data);
    }
  }

  destroy() {
    this.conn?.close();
    this.peer?.destroy();
    this.conn = null;
    this.peer = null;
  }
}
