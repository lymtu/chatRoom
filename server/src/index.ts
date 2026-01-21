import { Elysia, t } from "elysia";

/**
 * ws.id: token
 */
const wsConnectMap = new Map<string, string>();

new Elysia()
  .ws("/ws", {
    query: t.Object({
      token: t.String(),
    }),
    body: t.Object({
      type: t.String(),
      timestamp: t.Number(),
      message: t.String(),
    }),
    open(ws) {
      wsConnectMap.set(ws.id, ws.data.query.token);
    },
    message(ws, body) {
      if (body.type === "ping") {
        const pingTimestamp = body.timestamp;

        ws.send({ type: "pong", timestamp: Date.now() });
        return;
      }

      const token = wsConnectMap.get(ws.id);
      if (!token) return;

      ws.send({
        ...body,
        from: token,
      });
    },
  })
  .listen(2999, () => console.log("Server is running on port 2999"));
