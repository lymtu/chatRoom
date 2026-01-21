import "server-only";
import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) return false;
      return 2000;
    },
  },
}).on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

try {
  await client.ft.create(
    "idx:users",
    {
      "$.name": { type: "TEXT", AS: "name" },
      "$.id": { type: "TAG", AS: "id" },
      "$.role": { type: "TAG", AS: "role" },
    },
    {
      ON: "JSON",
      PREFIX: "token:",
    }
  );
} catch (error: unknown) {
  if (error instanceof Error && error.message.includes("already exists")) {
  } else {
    console.log(error);
  }
}

export default client;
