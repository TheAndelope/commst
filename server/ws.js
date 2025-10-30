// ws.js
import { WebSocketServer } from "ws";
import { rooms, createRoom, joinRoom, leaveRoom } from "./rooms.js";
import { submitAnswer, nextQuestion } from "./quiz.js";

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
      const data = JSON.parse(msg);

      switch (data.type) {
        case "createRoom":
          createRoom(data.roomId, data.playerId);
          ws.send(JSON.stringify({ type: "roomCreated", roomId: data.roomId }));
          break;

        case "joinRoom":
          if (joinRoom(data.roomId, { id: data.playerId, ws })) {
            ws.send(JSON.stringify({ type: "joinedRoom", roomId: data.roomId }));
          }
          break;

        case "nextQuestion":
          const room = rooms[data.roomId];
          if (!room) break;
          nextQuestion(room, data.question);
          broadcast(room.players, { type: "question", question: data.question });
          break;

        case "answer":
          const r = rooms[data.roomId];
          if (!r) break;
          submitAnswer(r, data.playerId, data.answer);
          broadcast(r.players, { type: "leaderboard", players: r.players });
          break;
      }
    });

    ws.on("close", () => {
      // Optional: remove player from all rooms
    });
  });

  function broadcast(players, message) {
    const msg = JSON.stringify(message);
    players.forEach(p => p.ws && p.ws.readyState === 1 && p.ws.send(msg));
  }

  return wss;
}

