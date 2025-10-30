//Websock Template (all vibe code lol)
import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Simple REST test
app.get("/", (req, res) => res.send("Quiz backend is running!"));

// Start HTTP + WS
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());
    ws.send(JSON.stringify({ type: "pong", msg: msg.toString() }));
  });

  ws.on("close", () => console.log("Client disconnected"));
});
