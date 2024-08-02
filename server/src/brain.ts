// import { CellEnum, CellType, Player, PlayerPosition } from "./types";

// const getNextPosition = (
//   grid: CellType[][],
//   player: Player,
// ): PlayerPosition => {
//   let dirY = 0;
//   let dirX = 0;

//   if (player.nextMove === "UP") dirY = -1;
//   else if (player.nextMove === "DOWN") dirY = 1;
//   else if (player.nextMove === "LEFT") dirX = -1;
//   else if (player.nextMove === "RIGHT") dirX = 1;

//   let x = player.position.x + dirX;
//   let y = player.position.y + dirY;

//   if (x < 0) x = grid[0].length - 1;
//   if (x >= grid[0].length) x = 0;
//   if (y < 0) y = grid.length - 1;
//   if (y >= grid.length) y = 0;

//   return { x, y };
// };

// const shouldEndGame = (grid: CellType[][]) => {
//   return !grid.some((row) =>
//     row.some((col) => col === CellEnum.PALLET || col === CellEnum.CRYSTAL),
//   );
// };

// export const calculateMove = (
//   grid: CellType[][],
//   players: Player[],
// ): boolean => {
//   const nextPositions = players.map((p) => getNextPosition(grid, p));

//   players.forEach((p, i) => {
//     console.log(
//       `next pos ${i} => y: ${nextPositions[i].y}, x: ${nextPositions[i].x}\n`,
//     );
//     // try to move, not a wall, and not clashing into opponent
//     if (
//       grid[nextPositions[i].y][nextPositions[i].x] !== CellEnum.WALL &&
//       !nextPositions.every(
//         (p) => p.x === nextPositions[0].x && p.y === nextPositions[0].y,
//       )
//     ) {
//       // add score to the player
//       if (grid[nextPositions[i].y][nextPositions[i].x] === CellEnum.PALLET) {
//         p.score += 1;
//       } else if (
//         grid[nextPositions[i].y][nextPositions[i].x] === CellEnum.CRYSTAL
//       ) {
//         p.score += 5;
//       }
//       grid[p.position.y][p.position.x] = CellEnum.EMPTY;
//       grid[nextPositions[i].y][nextPositions[i].x] = CellEnum.PLAYER_A + i;
//       p.position.y = nextPositions[i].y;
//       p.position.x = nextPositions[i].x;
//     }
//   });

//   return shouldEndGame(grid);
// };
import { CellEnum, CellType, MoveType, Player, PlayerPosition } from "./types";

// Determine the next position of a player based on their next move
const getNextPosition = (
  grid: CellType[][],
  player: Player,
): PlayerPosition => {
  const directions: Partial<Record<MoveType, { dirX: number; dirY: number }>> =
    {
      UP: { dirX: 0, dirY: -1 },
      DOWN: { dirX: 0, dirY: 1 },
      LEFT: { dirX: -1, dirY: 0 },
      RIGHT: { dirX: 1, dirY: 0 },
    };

  const { dirX, dirY } = directions[player.nextMove] || { dirX: 0, dirY: 0 };

  let x = (player.position.x + dirX + grid[0].length) % grid[0].length;
  let y = (player.position.y + dirY + grid.length) % grid.length;

  return { x, y };
};

// Check if the game should end based on remaining pallets and crystals
const shouldEndGame = (grid: CellType[][]): boolean => {
  return !grid.some((row) =>
    row.some((cell) => cell === CellEnum.PALLET || cell === CellEnum.CRYSTAL),
  );
};

// Calculate the next move for all players and update the grid and scores
export const calculateMove = (
  grid: CellType[][],
  players: Player[],
): boolean => {
  const nextPositions = players.map((player) => getNextPosition(grid, player));

  players.forEach((player, index) => {
    const nextPos = nextPositions[index];
    const { x, y } = nextPos;

    const isNotWall = grid[y][x] !== CellEnum.WALL;
    const isNotClashing = !nextPositions.every(
      (pos) => pos.x === nextPositions[0].x && pos.y === nextPositions[0].y,
    );

    if (isNotWall && isNotClashing) {
      // Update player's score based on the cell they move to
      if (grid[y][x] === CellEnum.PALLET) {
        player.score += 1;
      } else if (grid[y][x] === CellEnum.CRYSTAL) {
        player.score += 5;
      }

      // Update grid positions
      grid[player.position.y][player.position.x] = CellEnum.EMPTY;
      grid[y][x] = CellEnum.PLAYER_A + index;

      // Update player's position
      player.position = { x, y };
    }
  });

  return shouldEndGame(grid);
};
