import React, { FC, ReactNode } from "react";
import { Coordinates } from "../types";

interface MapProps {
  size: number;
  snake: Coordinates[];
  food: Coordinates;
  walls?: Coordinates[];
}

const Grid:FC<{ size:number, children?: ReactNode }> = ({ size, children }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${size}, 10px [col-start])`, gridTemplateRows: `repeat(${size}, 10px [row-start])` }}>
    {children}
  </div>
)

const coordinatesEqual = (c1:Coordinates, c2: Coordinates) => c1.x === c2.x && c1.y === c2.y;

const createMapCoordinates = (size:number) => {
  const map:Coordinates[] = [];
  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      map.push({ x, y });
    }
  }
  return map;
}

const GridItem:FC<{type?:string}> = ({ type }) => {
  if (type === "SNAKE") {
    return <div style={{background: "green"}}></div>;
  }
  if (type === "WALL") {
    return <div style={{background: "black"}}></div>;
  }
  if (type === "FOOD") {
    return <div style={{background: "brown"}}></div>;
  }
  return <div style={{background: "white"}}></div>;
}

const Map: FC<MapProps> = ({ size, snake, food, walls = [] }) => {
  const mapCoordinates = React.useMemo(() => createMapCoordinates(size), [size]);
  return (
    <Grid size={size}>
      {mapCoordinates.map((coordinates) => {
        const isFood = coordinatesEqual(food, coordinates);
        const isSnake = !!snake.find(c => coordinatesEqual(c, coordinates));
        const isWall = !!walls.find(c => coordinatesEqual(c, coordinates));
        return (
          <GridItem
            key={`${coordinates.x},${coordinates.y}`}
            type={(isFood && "FOOD") || (isSnake && "SNAKE") || (isWall && "WALL") || undefined}
          />)
      })}
    </Grid>
  )
}

export default Map;