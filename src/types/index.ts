export interface Coordinates {
  x: number;
  y: number;
}

export type Speed = 0.5 | 1 | 1.5;

export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT"
}

export enum GameState {
  STOPPED = "STOPPED",
  PLAYING = "PLAYING",
  GAME_OVER = "GAME_OVER",
  COMPELTE = "COMPLETE"
}