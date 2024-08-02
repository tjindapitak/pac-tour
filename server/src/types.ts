import { ChildProcess } from "child_process";

export enum CellEnum {
  WALL = 1,
  EMPTY = 2,
  PALLET = 3,
  CRYSTAL = 4,
  PLAYER_A = 5,
  PLAYER_B = 6,
}

export type CellType =
  | 0
  | CellEnum.WALL
  | CellEnum.EMPTY
  | CellEnum.PALLET
  | CellEnum.CRYSTAL
  | CellEnum.PLAYER_A
  | CellEnum.PLAYER_B;

export interface GridProps {
  grid: CellType[][];
}

export interface PlayerPosition {
  x: number;
  y: number;
}

export type MoveType = "UP" | "DOWN" | "LEFT" | "RIGHT" | "";
export interface Player {
  code: string;
  position: PlayerPosition;
  nextMove: MoveType;
  fork?: ChildProcess;
  score: number;
}

export interface Game {
  id: string;
  players?: Player[];
  interval?: NodeJS.Timeout;
}
