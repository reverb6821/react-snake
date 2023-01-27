import React, { useRef, useEffect, useState } from "react";

import useInterval from './utils/useInterval'
import { IUser } from './interface/IUser';

import Scorelist from './components/Scorelist/Scorelist';
import Score from './components/Score/Score';
import Input from './components/Input/Input';

import './App.sass'

const SCALE: number = 10;
const CANVAS_SIZE: number = 400;
const INITIAL_SPEED: number = 120;
const MAX_SPEED: number = 20;
const SNAKE_START: number[][] = [
  [5, 5],
  [4, 5],
];
const APPLE_START: number[] = [20, 4];

function App() {
  const canvasRef: any = useRef<HTMLCanvasElement | null>(null);

  const [snake, setSnake] = useState<number[][]>(SNAKE_START);
  const [direction, setDirection] = useState<number[]>([0, 0]);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);

  const [apple, setApple] = useState<number[]>(APPLE_START);

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const [inputVal, setInputVal] = useState<string>("");

  const [user, setUser] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [lastUser, setLastUser] = useState<IUser>({ name: "", score: 0 });

  const handleControl = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        setDirection([-1, 0]);
        break;

      case "ArrowUp":
        setDirection([0, -1]);
        break;

      case "ArrowRight":
        setDirection([1, 0]);
        break;

      case "ArrowDown":
        setDirection([0, 1]);
        break;

      default:
        break;
    }
  };

  const isInBounds = (headX: number, headY: number) => {
    const futureX = headX * SCALE + direction[0] * SCALE;
    const futureY = headY * SCALE + direction[1] * SCALE;
    return (
      futureX < CANVAS_SIZE &&
      futureX >= 0 &&
      futureY < CANVAS_SIZE &&
      futureY >= 0
    );
  };

  const isAlive = (headX: number, headY: number) => {
    const snakeCopy = snake.slice(1);
    for (const el of snakeCopy) {
      if (headX === el[0] && headY === el[1]) return false;
    }

    return isInBounds(headX, headY);
  };

  const generateRandomCoordinate = () => {
    return Math.floor((Math.random() * CANVAS_SIZE) / SCALE);
  };

  const updateApple = (snakeCopy: number[][]) => {
    let randomX = generateRandomCoordinate();
    let randomY = generateRandomCoordinate();
    for (const el of snakeCopy) {
      if (el[0] === randomX && el[1] === randomY) {
        randomX = generateRandomCoordinate();
        randomY = generateRandomCoordinate();
      }
    }
    setApple([randomX, randomY]);
  };

  const growSnake = (snakeCopy: number[][]) => {
    const newTail = [apple[0] - direction[0], apple[1] - direction[1]];
    snakeCopy.push(newTail);
    setSnake(snakeCopy);
  };

  const updateSnake = () => {
    const copy = [...snake];
    const firstEl = copy[0];
    const newHead = [firstEl[0] + direction[0], firstEl[1] + direction[1]];
    copy.unshift(newHead);
    copy.pop();
    setSnake(copy);
  };

  const startGame = () => {
    if (inputVal) {
      setUser(inputVal);
      setInputVal("");
      setGameOver(false);
      setGameRunning(true);
      setDirection([1, 0]);
    }
  };

  const updateGame = (headX: number, headY: number) => {
    updateSnake();
    if (headX === apple[0] && headY === apple[1]) {
      const snakeCopy = [...snake];
      growSnake(snakeCopy);
      updateApple(snakeCopy);
      if (speed > MAX_SPEED) {
        setSpeed(speed - 4);
      }
      setScore(score + 10);
    }
  };

  const endGame = () => {
    setLastUser({ name: user, score: score });
    const usersCopy = [...users];
    usersCopy.push({ name: user, score: score });
    const userScore = Math.max.apply(
      Math,
      usersCopy.map((user) => user.score)
    );
    setHighScore(userScore);
    setUsers(usersCopy);
    setGameRunning(false);
    setGameOver(true);
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setScore(0);
    setDirection([0, 0]);
    setSpeed(INITIAL_SPEED);
    setInputVal("");
    setUser("");
  };

  const loopGame = () => {
    const headX: number = snake[0][0];
    const headY: number = snake[0][1];

    if (isAlive(headX, headY) && gameRunning) {
      updateGame(headX, headY);
    } else {
      endGame();
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = "rgb(50, 168, 82)";
    snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));

    ctx.fillStyle = "rgb(209, 31, 31)";
    ctx.fillRect(apple[0], apple[1], 1, 1);

    window.addEventListener("keydown", handleControl);

    return () => {
      window.removeEventListener("keydown", handleControl);
    };
  }, [apple, snake, users]);

  useInterval(() => {
    if (gameRunning) {
      loopGame();
    }
  }, speed);

  return (
    <div className="App">
      <div className="container-left">
        <div className="message-board card">
          {gameOver ? (
            <div>
              <h1 className="game-title">Game Over {lastUser.name}!</h1>
              <p className="text-bold">Score: {lastUser.score}</p>
            </div>
          ) : (
            <h1 className="game-title">Snake Game!</h1>
          )}

          {user ? (
            <Score highScore={highScore} score={score} user={user} />
          ) : (
            <Input
              playerNumber={users.length + 1}
              inputValue={inputVal}
              onInputChange={(val: string) => setInputVal(val)}
              onBtnClick={startGame}
            />
          )}
        </div>
        <canvas ref={canvasRef} height={CANVAS_SIZE} width={CANVAS_SIZE} />
      </div>
      <Scorelist users={users} />
    </div>
  )
}

export default App
