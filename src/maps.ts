import { Coordinates } from "./types";


const easy = () => [];

const medium = (size: number) => {
  const walls:Coordinates[]= [];
  const gaps = [
    {x: 0, y: Math.round(size / 2) - 1},
    {x: 0, y: Math.round(size / 2)},
    {x: 0, y: Math.round(size / 2) + 1},
    {x: size - 1, y: Math.round(size / 2) - 1},
    {x: size - 1, y: Math.round(size / 2)},
    {x: size -1 , y: Math.round(size / 2) + 1}
  ];

  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      const isGap = gaps.find(g => g.x === x && g.y === y);
      if (!isGap && (x === 0 || y === 0 || x === size - 1 || y === size - 1)) {
        walls.push({ x, y });
      }
    }
  }
  return walls;
}

const hard = (size: number) => {
  const walls:Coordinates[]= [];
  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      if (x === 0 || y === 0 || x === size - 1 || y === size - 1) {
        walls.push({ x, y });
      }
    }
  }
  return walls;
}

export {
  easy,
  medium,
  hard
}