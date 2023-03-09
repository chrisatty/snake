import React, { FC, useState, useEffect, useCallback } from "react";
import { easy, hard, medium } from "./maps";
import Map from "./components/Map";
import sample from "lodash.sample";
import { Coordinates, GameState, Direction } from "./types";
import Options from "./components/Options";

interface SnakeGameProps {
  size?: number;
}

const randomCoordinates = (size: number, exclusions:Coordinates[] = []):Coordinates | undefined => {
  const indexSize = size - 1;
  const allCoordinates = new Array(Math.pow(indexSize, 2))
                            .fill(0)
                            .map((num,i) => `${i % indexSize},${Math.floor(i / indexSize)}`);

  const exclusionStrings = exclusions.map(c => `${c.x},${c.y}`);
  
  const random = sample(allCoordinates.filter(c => !exclusionStrings.includes(c)));
  if (!random) {
    return;
  }
  return {
    x: Number(random.split(",")[0]),
    y: Number(random.split(",")[1])
  }
}

const speedOptions = [
  { value: "0.5", text: "Slow" },
  { value: "1", text: "Normal" },
  { value: "2", text: "Fast" },
];

const levelOptions = [
  { value: "easy", text: "Easy" },
  { value: "medium", text: "Medium" },
  { value: "hard", text: "Hard" },
];

const VERTICAL = [ Direction.UP, Direction.DOWN ];
const HORIZONTAL = [ Direction.LEFT, Direction.RIGHT ];

const getWalls = (level:string, size: number) => {
  if (level === "easy") {
    return easy();
  } else if (level === "medium") {
    return medium(size);
  }
  return hard(size);
}

const SnakeGame:FC<SnakeGameProps> = ({ size = 20 }) => {
  const [level, setLevel] = useState("medium");
  const [speed, setSpeed] = useState(1);
  const [walls, setWalls] = React.useState(getWalls(level, size));
  const [snake, setSnake] = useState<Coordinates[]>([]);
  const [score, setScore] = useState(0);
  const [directions, setDirection] = useState<Direction[]>([Direction.DOWN]);
  const [gameStatus, setGameStatus] = useState(GameState.STOPPED);
  const [food, setFood] = useState<Coordinates>({ x: -1, y: -1});

  const onKeyDown = (key:string) => {
    if (directions.length >= 3) {
      return;
    }
    const newDirections = [...directions];
    const nextDirection = directions[directions.length - 1] || Direction.DOWN;
    switch (key) {
      case "ArrowDown": {
        if (HORIZONTAL.includes(nextDirection)) {
          newDirections.push(Direction.DOWN);
          setDirection(newDirections);
        }
        break;
      }
      case "ArrowUp": {
        if (HORIZONTAL.includes(nextDirection)) {
          newDirections.push(Direction.UP);
          setDirection(newDirections);
        }
        break;
      }
      case "ArrowLeft": {
        if (VERTICAL.includes(nextDirection)) {
          newDirections.push(Direction.LEFT);
          setDirection(newDirections);
        }
        break;
      }
      case "ArrowRight": {
        if (VERTICAL.includes(nextDirection)) {
          newDirections.push(Direction.RIGHT);
          setDirection(newDirections);
        }
        break;
      }
    }
  }

  const newGame = () => {
    const newSnake = [{ x: Math.ceil(size / 2), y: Math.ceil(size / 2)}];
    const newWalls = getWalls(level, size);
    setWalls(newWalls);
    setSnake(newSnake);
    const newFood = randomCoordinates(size, newWalls.concat(newSnake));
    if (!newFood) {
      throw Error("Could not start game");
    }
    setFood(newFood);
    setGameStatus(GameState.PLAYING);
    setDirection([Direction.DOWN]);
    setScore(0);
  }

  const gameStep = useCallback(() => {
    const snakeHead = snake[snake.length - 1];
    const nextDirection = directions[0] || Direction.DOWN;
    let nextSquare:Coordinates;
    if (nextDirection === Direction.UP) {
      nextSquare = { x: snakeHead.x, y: snakeHead.y + 1 > (size - 1) ? 0 : snakeHead.y + 1 };
    } else if (nextDirection === Direction.DOWN) {
      nextSquare = { x: snakeHead.x, y: snakeHead.y - 1 < 0 ? (size - 1) : snakeHead.y - 1 };
    } else if (nextDirection === Direction.LEFT) {
      nextSquare = { x: snakeHead.x - 1 < 0 ? (size - 1) : snakeHead.x - 1, y: snakeHead.y };
    } else { // RIGHT
      nextSquare = { x: snakeHead.x + 1 > (size - 1) ? 0 : snakeHead.x + 1, y: snakeHead.y };
    }
    if (walls.find(s => s.x === nextSquare.x && s.y === nextSquare.y)) {
      setGameStatus(GameState.GAME_OVER);
      return;
    }
    if (snake.find(s => s.x === nextSquare.x && s.y === nextSquare.y)) {
      setGameStatus(GameState.GAME_OVER);
      return;
    }
    if (nextSquare.x === food.x && nextSquare.y === food.y) {
      const newSnake = [...snake];
      newSnake.push(nextSquare);
      setSnake(newSnake);
      const newFood = randomCoordinates(size, walls.concat(snake));
      setScore(prev => prev + 10);
      if (newFood) {
        setFood(newFood);
      } else {
        setGameStatus(GameState.COMPELTE)
      }
    } else {
      const newSnake = [...snake];
      newSnake.push(nextSquare);
      newSnake.shift();
      setSnake(newSnake);
    }
    if (directions.length > 1) {
      const newDirections = [...directions];
      newDirections.shift();
      setDirection(newDirections);
    }
  }, [directions, walls, food, snake, size])

  useEffect(() => {
    if (gameStatus !== GameState.PLAYING) {
      return;
    }
    const id = setTimeout(gameStep, 200 / speed);

    return () => clearInterval(id);
  }, [speed, gameStatus, gameStep]);

  return (
    <div onKeyDown={(e) => onKeyDown(e.key)} tabIndex={0}>
      <div>Score: {score}</div>
      <div>
        <Options
          name="speed"
          label="Speed"
          options={speedOptions}
          onChange={(value) => setSpeed(Number(value))}
          disabled={gameStatus === GameState.PLAYING}
          value={`${speed}`}
        />
      </div>
      <div>
        <Options
          name="level"
          label="Level"
          options={levelOptions}
          onChange={setLevel}
          disabled={gameStatus === GameState.PLAYING}
          value={level}
        />
      </div>
      <Map
        size={size}
        snake={snake}
        food={food}
        walls={walls}
      />
      {gameStatus !== GameState.PLAYING && 
        <button onClick={newGame}>PLAY!</button>
      }
      {gameStatus === GameState.GAME_OVER && <div>GAME OVER</div>}
      {gameStatus === GameState.COMPELTE && <div>YOU WON!</div>}
    </div>
  );
}

export default SnakeGame;