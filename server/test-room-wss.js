const { WebSocket, WebSocketServer } = require("ws");

const port = 3000;
const host = "localhost";

const Whitelist = ["http://127.0.0.1:5500", "http://localhost:5173"];

const wss = new WebSocketServer({ port });

wss.on("connection", (ws, req) => {
  if (req.headers.origin && !Whitelist.includes(req.headers.origin)) {
    ws.close();
    return new Response("Not allowed", { status: 403 });
  }
  console.log("New connection");

  ws.on("message", (message, isBinary) => {
    // {date: number, content: string, userName: string}
    const data = JSON.parse(Buffer.from(message).toString());
    if (
      !data?.date ||
      !data?.content ||
      data.content.length > 100 ||
      !data?.userName
    ) {
      ws.send("Invalid message format");
      return;
    }

    wss.clients.forEach((client) => {
      if (client.readyState !== WebSocket.OPEN) return;
      // if (client === ws) return;
      client.send(message, { binary: isBinary });
    });
  });

  ws.on("close", () => {});
});

wss.on("listening", () => {
  console.log("WebSocket server listening on ws://" + host + ":" + port);
});
