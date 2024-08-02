export type CellType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface GridProps {
  grid: CellType[][];
}

export interface Message {
  id: number;
  content: string;
}

export interface GameData {
  cmd?: string;
  grid?: CellType[][];
  moves?: string[];
  scores?: number[];
}

export interface GameWSMessage {
  uuid: string;
  cmd: string;
  playerACode: string;
  playerBCode: string;
}
