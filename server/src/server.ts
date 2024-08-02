import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { fork } from "child_process";
import { CellType, Game, MoveType, Player } from "./types";
import { join } from "path";
import { calculateMove } from "./brain";
import { SIGTERM } from "constants";
import { log } from "console";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Serve static files
app.use(express.static("public"));

const games: Game[] = [];

// Initialize game grid
const initialGrid: CellType[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 1, 2, 1],
  [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 4, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Handle WebSocket connections
wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

  ws.on("message", async (message: string) => {
    const request = JSON.parse(message);

    if (request.cmd === "start" || request.cmd === "restart") {
      handleGameStart(ws, request);
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
  ws.on("error", (error) => console.error("WebSocket error:", error));
});

function handleGameStart(ws: WebSocket, request: any) {
  console.log("");
  console.log("========================================================");
  console.log("==================== start new game ====================");
  console.log("========================================================");
  console.log(`id: ${request.uuid}`);

  const gameIndex = games.findIndex((g) => g.id === request.uuid);
  // existing game id
  if (gameIndex !== -1) {
    games[gameIndex].players?.forEach((p) => {
      p.fork?.kill(SIGTERM);
    });

    clearInterval(games[gameIndex].interval);
    games.splice(gameIndex, 1);
  }
  const game: Game = { id: request.uuid };
  games.push(game);

  const grid = JSON.parse(JSON.stringify(initialGrid)); // Deep copy of initial grid

  const players = createPlayers(request, grid);

  game.players = players;

  startGameLoop(game, ws, grid, players);
}

function createPlayers(request: any, grid: CellType[][]): Player[] {
  const players: Player[] = [
    {
      code: request.playerACode,
      position: { x: 1, y: 1 },
      nextMove: "",
      fork: undefined,
      score: 0,
    },
    {
      code: request.playerBCode,
      position: { x: grid[0].length - 2, y: grid.length - 2 },
      nextMove: "",
      fork: undefined,
      score: 0,
    },
  ];

  console.log("create players ...");

  players.forEach((player) => {
    player.fork = fork(join(__dirname, "player.js"), [
      "-r",
      "ts-node/register",
    ]);
    player.fork.on("message", (msg: MoveType) => (player.nextMove = msg));

    player.fork.send({ cmd: "setup", code: player.code });
  });

  console.log("creating players ... done");

  return players;
}

function startGameLoop(
  game: Game,
  ws: WebSocket,
  grid: CellType[][],
  players: Player[],
) {
  let firstMove = true;

  // broadcast the map
  broadcastGameState(ws, grid, players);

  console.log("start game loop ...");
  game.interval = setInterval(() => {
    if (!firstMove) {
      const shouldEndGame = calculateMove(grid, players);

      broadcastGameState(ws, grid, players);

      if (shouldEndGame) {
        endGame(game, ws);
        console.log("start game loop ...");
      }

      players.forEach((player) => (player.nextMove = ""));
    }

    players.forEach((player) => {
      player.fork?.send({ cmd: "next", grid });
    });
    if (firstMove) firstMove = false;
  }, 750);

  console.log("start game loop ... done");
}

function broadcastGameState(
  ws: WebSocket,
  grid: CellType[][],
  players: Player[],
) {
  const state = {
    grid,
    moves: players.map((p) => p.nextMove),
    scores: players.map((p) => p.score),
  };

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(state));
  }
}

function endGame(game: Game, ws: WebSocket) {
  clearInterval(game.interval);
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ cmd: "end-game" }));
  }
}

// Start the server
const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
