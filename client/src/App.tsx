import { CellType, GameData, GameWSMessage } from "./types";
import { PacmanGrid } from "./PacmanGrid";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const uuid = uuidv4();

const botA =
  'function getNextMove(grid) {\n  const directions = ["UP", "DOWN", "LEFT", "RIGHT"];\n  const moves = [\n    [-1, 0], // UP\n    [1, 0],  // DOWN\n    [0, -1], // LEFT\n    [0, 1]   // RIGHT\n  ];\n\n  const playerPos = findPlayer(grid);\n  if (!playerPos) return null; // If player not found, return null\n\n  const [px, py] = playerPos;\n  const target = findNearestPallet(grid, px, py);\n\n  if (!target) return null; // If no pallet is found, return null\n\n  const [tx, ty] = target;\n  const nextStep = bfsNextStep(grid, px, py, tx, ty);\n\n  if (!nextStep) return null; // If no valid path, return null\n\n  const [nx, ny] = nextStep;\n\n  for (let i = 0; i < moves.length; i++) {\n    const [dx, dy] = moves[i];\n    if (px + dx === nx && py + dy === ny) {\n      return directions[i];\n    }\n  }\n\n  return null;\n}\n\nfunction findPlayer(grid) {\n  for (let i = 0; i < grid.length; i++) {\n    for (let j = 0; j < grid[i].length; j++) {\n      if (grid[i][j] === 5) { // Player A is represented by 5\n        return [i, j];\n      }\n    }\n  }\n  return null;\n}\n\nfunction isValidMove(grid, x, y) {\n  return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== 1;\n}\n\nfunction findNearestPallet(grid, px, py) {\n  const queue = [[px, py]];\n  const visited = new Set();\n  visited.add(`${px},${py}`);\n\n  while (queue.length > 0) {\n    const [x, y] = queue.shift();\n\n    if (grid[x][y] === 3 || grid[x][y] === 4) { // Found a pallet\n      return [x, y];\n    }\n\n    const moves = [\n      [-1, 0], // UP\n      [1, 0],  // DOWN\n      [0, -1], // LEFT\n      [0, 1]   // RIGHT\n    ];\n\n    for (const [dx, dy] of moves) {\n      const nx = x + dx;\n      const ny = y + dy;\n\n      if (isValidMove(grid, nx, ny) && !visited.has(`${nx},${ny}`)) {\n        queue.push([nx, ny]);\n        visited.add(`${nx},${ny}`);\n      }\n    }\n  }\n\n  return null; // No pallet found\n}\n\nfunction bfsNextStep(grid, sx, sy, tx, ty) {\n  const queue = [[sx, sy]];\n  const visited = new Set();\n  const parents = {};\n  visited.add(`${sx},${sy}`);\n\n  const moves = [\n    [-1, 0], // UP\n    [1, 0],  // DOWN\n    [0, -1], // LEFT\n    [0, 1]   // RIGHT\n  ];\n\n  while (queue.length > 0) {\n    const [x, y] = queue.shift();\n\n    if (x === tx && y === ty) { // Reached the target\n      let current = [tx, ty];\n      let previous = null;\n\n      while (current && (current[0] !== sx || current[1] !== sy)) {\n        previous = current;\n        current = parents[`${current[0]},${current[1]}`];\n      }\n\n      return previous;\n    }\n\n    for (const [dx, dy] of moves) {\n      const nx = x + dx;\n      const ny = y + dy;\n\n      if (isValidMove(grid, nx, ny) && !visited.has(`${nx},${ny}`)) {\n        queue.push([nx, ny]);\n        visited.add(`${nx},${ny}`);\n        parents[`${nx},${ny}`] = [x, y];\n      }\n    }\n  }\n\n  return null; // No valid path found\n}\n\nreturn getNextMove(grid);';

const botB =
  'function getNextMove(grid) {\n  const directions = ["UP", "DOWN", "LEFT", "RIGHT"];\n  const moves = [\n    [-1, 0], // UP\n    [1, 0],  // DOWN\n    [0, -1], // LEFT\n    [0, 1]   // RIGHT\n  ];\n\n  const playerPos = findPlayer(grid);\n  if (!playerPos) return null; // If player not found, return null\n\n  const [px, py] = playerPos;\n  const target = findNearestPallet(grid, px, py);\n\n  if (!target) return null; // If no pallet is found, return null\n\n  const [tx, ty] = target;\n  const nextStep = bfsNextStep(grid, px, py, tx, ty);\n\n  if (!nextStep) return null; // If no valid path, return null\n\n  const [nx, ny] = nextStep;\n\n  for (let i = 0; i < moves.length; i++) {\n    const [dx, dy] = moves[i];\n    if (px + dx === nx && py + dy === ny) {\n      return directions[i];\n    }\n  }\n\n  return null;\n}\n\nfunction findPlayer(grid) {\n  for (let i = 0; i < grid.length; i++) {\n    for (let j = 0; j < grid[i].length; j++) {\n      if (grid[i][j] === 6) { // Player B is represented by 6\n        return [i, j];\n      }\n    }\n  }\n  return null;\n}\n\nfunction isValidMove(grid, x, y) {\n  return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== 1;\n}\n\nfunction findNearestPallet(grid, px, py) {\n  const queue = [[px, py]];\n  const visited = new Set();\n  visited.add(`${px},${py}`);\n\n  while (queue.length > 0) {\n    const [x, y] = queue.shift();\n\n    if (grid[x][y] === 3 || grid[x][y] === 4) { // Found a pallet\n      return [x, y];\n    }\n\n    const moves = [\n      [-1, 0], // UP\n      [1, 0],  // DOWN\n      [0, -1], // LEFT\n      [0, 1]   // RIGHT\n    ];\n\n    for (const [dx, dy] of moves) {\n      const nx = x + dx;\n      const ny = y + dy;\n\n      if (isValidMove(grid, nx, ny) && !visited.has(`${nx},${ny}`)) {\n        queue.push([nx, ny]);\n        visited.add(`${nx},${ny}`);\n      }\n    }\n  }\n\n  return null; // No pallet found\n}\n\nfunction bfsNextStep(grid, sx, sy, tx, ty) {\n  const queue = [[sx, sy]];\n  const visited = new Set();\n  const parents = {};\n  visited.add(`${sx},${sy}`);\n\n  const moves = [\n    [-1, 0], // UP\n    [1, 0],  // DOWN\n    [0, -1], // LEFT\n    [0, 1]   // RIGHT\n  ];\n\n  while (queue.length > 0) {\n    const [x, y] = queue.shift();\n\n    if (x === tx && y === ty) { // Reached the target\n      let current = [tx, ty];\n      let previous = null;\n\n      while (current && (current[0] !== sx || current[1] !== sy)) {\n        previous = current;\n        current = parents[`${current[0]},${current[1]}`];\n      }\n\n      return previous;\n    }\n\n    for (const [dx, dy] of moves) {\n      const nx = x + dx;\n      const ny = y + dy;\n\n      if (isValidMove(grid, nx, ny) && !visited.has(`${nx},${ny}`)) {\n        queue.push([nx, ny]);\n        visited.add(`${nx},${ny}`);\n        parents[`${nx},${ny}`] = [x, y];\n      }\n    }\n  }\n\n  return null; // No valid path found\n}\nreturn getNextMove(grid);';

const useWebSocket = (handleMessage: (gameData: GameData) => void) => {
  const ws = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    ws.current = new WebSocket(`ws://${window.location.hostname}:3010`);
    ws.current.onopen = () => console.log("Connected to the WebSocket server");
    ws.current.onmessage = (event: MessageEvent) =>
      handleMessage(JSON.parse(event.data));
    ws.current.onclose = () =>
      console.log("Disconnected from the WebSocket server");
  }, [handleMessage]);

  const sendMessage = useCallback(
    (message: GameWSMessage) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message));
      } else {
        connectWebSocket();
        if (ws.current) {
          ws.current.onopen = () => {
            if (ws.current) ws.current.send(JSON.stringify(message));
          };
        }
      }
    },
    [connectWebSocket],
  );

  return { sendMessage, connectWebSocket };
};

const App = () => {
  const [grid, setGrid] = useState<CellType[][]>();
  const [nextMoves, setNextMoves] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);

  const playerACodeRef = useRef<HTMLTextAreaElement>(null);
  const playerBCodeRef = useRef<HTMLTextAreaElement>(null);

  const handleGameMessage: (gameData: GameData) => void = useCallback(
    (gameData: GameData) => {
      if (gameData.cmd === "end-game") {
        setGameOver(true);
        return;
      }

      if (gameData.grid && gameData.moves) {
        setGrid(gameData.grid);
        setNextMoves(gameData.moves);

        if (gameData.scores) {
          setScores(gameData.scores);
        }
      }
    },
    [],
  );

  const { sendMessage } = useWebSocket(handleGameMessage);

  const handleStart = useCallback(() => {
    const getPlayerCode = (
      ref: React.RefObject<HTMLTextAreaElement>,
      defaultCode: string,
    ) => {
      return ref.current && ref.current.value ? ref.current.value : defaultCode;
    };

    const playerACode = getPlayerCode(playerACodeRef, botA);
    const playerBCode = getPlayerCode(playerBCodeRef, botB);

    const message: GameWSMessage = {
      uuid,
      cmd: "start",
      playerACode,
      playerBCode,
    };

    sendMessage(message);
  }, [sendMessage]);

  useEffect(() => {
    if (gameOver) {
      const [scoreA, scoreB] = scores;
      if (scoreA > scoreB) {
        setWinner("Player A");
      } else if (scoreB > scoreA) {
        setWinner("Player B");
      } else {
        setWinner("It's a tie");
      }
    }
  }, [gameOver, scores]);

  const handleCloseModal = () => {
    setGameOver(false);
    setWinner(null);
    setScores([]);
    setNextMoves([]);
    setGrid(undefined);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-permanentMarker">
      <h1 className="text-3xl font-bold mb-8 text-center">
        PacTour v1: The Ultimate Coding Battle Arena! (title generated by
        ChatGPT)
      </h1>
      <div className="w-full max-w-lg mb-6">
        <label className="block mb-2 text-lg">Player A</label>
        <textarea
          className="w-full p-4 border rounded-lg resize-none font-sourceCodedPro"
          rows="4"
          placeholder="Paste Player A code here ..."
          ref={playerACodeRef}
        />
      </div>
      <div className="w-full max-w-lg mb-8">
        <label className="block mb-2 text-lg">PlayeB</label>
        <textarea
          className="w-full p-4 border rounded-lg resize-none font-sourceCodedPro"
          rows="4"
          placeholder="Paste Player B code here ..."
          ref={playerBCodeRef}
        />
      </div>
      <button
        className="px-8 py-4 bg-blue-500 text-white rounded-lg text-xl font-semibold hover:bg-blue-600 mb-8"
        onClick={handleStart}
      >
        START
      </button>
      <div className="w-full max-w-lg mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-left text-6xl">
            <p>{scores && scores[0]}</p>
          </div>
          <div className="text-right text-6xl">
            <p>{scores && scores[1]}</p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-lg mb-8 h-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-left">
            <p>{nextMoves[0] ? nextMoves[0] : " "}</p>
          </div>
          <div className="text-right">
            <p>{nextMoves[1] ? nextMoves[1] : " "}</p>
          </div>
        </div>
      </div>
      {grid && <PacmanGrid grid={grid} />}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <p className="text-lg mb-4">Winner: {winner}</p>
            <p className="text-lg mb-4">Final Scores:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-left">
                <p>Player A: {scores ? scores[0] : 0}</p>
              </div>
              <div className="text-right">
                <p>Player B: {scores ? scores[1] : 0}</p>
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
