import { CellType } from "./types";

let nextMoveFn: Function;

process.on(
  "message",
  (msg: { cmd: string; code?: string; grid?: CellType[][] }) => {
    if (msg.cmd === "setup" && msg.code) {
      try {
        nextMoveFn = new Function("grid", msg.code);
      } catch (e) {
        console.log(e);
      }
    } else if (msg.cmd === "next") {
      const nextMoveResult = nextMoveFn(msg.grid);
      process.send && process.send(nextMoveResult);
    }
  },
);
