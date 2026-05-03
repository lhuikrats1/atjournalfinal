import WebSocket from "ws";

export class TradovateWebSocket {
  ws: WebSocket | null = null;
  url: string;
  token: string;
  onFillCb?: (fillData: any) => void;

  constructor(token: string, isDemo: boolean = true) {
    this.token = token;
    this.url = isDemo ? "wss://demo.tradovateapi.com/v1/websocket" : "wss://live.tradovateapi.com/v1/websocket";
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.on("open", () => {
      console.log("Tradovate WS connected.");
      this.authorize();
    });

    this.ws.on("message", (data) => {
      this.handleMessage(data.toString());
    });

    this.ws.on("close", () => {
      console.log("Tradovate WS closed.");
      // Add reconnection logic later if needed
    });

    this.ws.on("error", (err) => {
      console.error("Tradovate WS error:", err);
    });
  }

  onFill(cb: (fillData: any) => void) {
    this.onFillCb = cb;
  }

  private authorize() {
    if (!this.ws) return;
    this.ws.send(`authorize\n\n${this.token}`);
  }

  private handleMessage(message: string) {
    // Basic heartbeat handling (usually 'o', 'h', etc)
    if (message === "o" || message === "h") {
      return;
    }

    try {
      // Tradovate WS responds with messages starting with "a" (array of events)
      if (message.startsWith("a")) {
        const events = JSON.parse(message.slice(1));
        for (const event of events) {
          if (event.e === "props") {
             // Handle entity updates (e.g., Fills, Orders, Positions)
             if (event.d && event.d.entityType === "fill") {
                 this.onFillCb?.(event.d.entity);
             }
          }
        }
      }
    } catch (e) {
      console.error("Error parsing WS message:", e);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
