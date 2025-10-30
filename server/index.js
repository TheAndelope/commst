import express from "express";
import cors from "cors";
import { createServer } from "http";
import { initWebSocket } from "./ws.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const server = createServer(app);
initWebSocket(server);

app.get("/", (req, res) => res.send("Quiz backend running"));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

