import { GridProps, CellType } from "./types";

const PacmanGrid: React.FC<GridProps> = ({ grid }) => {
  return (
    <div className="inline-block p-4 bg-gray-800 rounded-lg shadow-lg">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`w-8 h-8 flex items-center justify-center ${cellClass(cell)}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

const cellClass = (cell: CellType) => {
  switch (cell) {
    case 1:
      return "wall";
    case 2:
      return "path";
    case 3:
      return "bg-black relative pellet";
    case 4:
      return "bg-black relative crystal";
    case 5:
      return "pacman-A";
    case 6:
      return "pacman-B transform rotate-180";
    default:
      return "bg-gray-900";
  }
};

export { PacmanGrid };
