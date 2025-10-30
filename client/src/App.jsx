import { useState, useEffect, useRef } from "react";

function App() {
  const [ws, setWs] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [question, setQuestion] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const wsRef = useRef(null);

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:3001");
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      socket.send(JSON.stringify({ type: "joinRoom", roomId, playerId }));
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "question") setQuestion(data.question);
      else if (data.type === "leaderboard") setLeaderboard(data.players);
    };

    setWs(socket);
  };

  const sendAnswer = (answer) => {
    if (!wsRef.current) return;
    wsRef.current.send(
      JSON.stringify({ type: "answer", roomId, playerId, answer })
    );
  };

  return (
    <div style={{ padding: "1rem" }}>
      {!ws && (
        <div>
          <input
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            placeholder="Player ID"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
          />
          <button onClick={connectWebSocket}>Join Room</button>
        </div>
      )}

      {question && (
        <div>
          <h2>{question.text}</h2>
          {question.options.map((o) => (
            <button key={o} onClick={() => sendAnswer(o)}>
              {o}
            </button>
          ))}
        </div>
      )}

      {leaderboard.length > 0 && (
        <div>
          <h3>Leaderboard</h3>
          {leaderboard.map((p) => (
            <div key={p.id}>
              {p.id}: {p.score || 0}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

