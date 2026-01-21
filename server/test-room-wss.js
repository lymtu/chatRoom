const express = require("express");
const { WebSocket, WebSocketServer } = require("ws");

const port = 2999;
const host = "localhost";

const Whitelist = ["http://localhost:3000"];

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
