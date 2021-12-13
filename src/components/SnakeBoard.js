import React, { useEffect, useState, useRef } from "react";
import Lottie from "react-lottie";
import Blank from "../blank.png";
import Snake from "../snake.png";
import Food from "../food.png";
import animationData from "./snake.json";
function SnakeBoard() {
  let initialRows = [];
  for (let i = 0; i < 10; i++) {
    initialRows.push([]);
    for (let k = 0; k < 10; k++) {
      initialRows[i].push("blank");
    }
  }
  const randomPosition = () => {
    const position = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    };
    return position;
  };
  const [rows, setRows] = useState(initialRows);
  const [snake, setSnake] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ]);
  const [direction, setDirection] = useState("right");

  const [food, setFood] = useState(randomPosition);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const changeDirectionWithKeys = (e) => {
    var { keyCode } = e;
    switch (keyCode) {
      case 37:
        setDirection("left");
        break;
      case 38:
        setDirection("top");
        break;
      case 39:
        setDirection("right");
        break;
      case 40:
        setDirection("bottom");
        break;
      case 32:
        setDirection("stop");
        break;
      default:
        break;
    }
  };

  document.addEventListener("keydown", changeDirectionWithKeys, false);
  const displaySnake = () => {
    const newRows = initialRows;
    snake.forEach((cell) => {
      newRows[cell.x][cell.y] = "snake";
    });

    newRows[food.x][food.y] = "food";
    setRows(newRows);
  };
  const moveSnake = () => {
    const newSnake = [];
    switch (direction) {
      case "right":
        newSnake.push({ x: snake[0].x, y: (snake[0].y + 1) % 10 });
        break;
      case "left":
        newSnake.push({ x: snake[0].x, y: (snake[0].y - 1 + 10) % 10 });
        break;
      case "top":
        newSnake.push({ x: (snake[0].x - 1 + 10) % 10, y: snake[0].y });
        break;
      case "bottom":
        newSnake.push({ x: (snake[0].x + 1) % 10, y: snake[0].y });
        break;

      default:
        return;
    }
    snake.forEach((cell) => {
      newSnake.push(cell);
    });
    if (snake[0].x === food.x && snake[0].y === food.y) {
      setFood(randomPosition);
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
    isCollapsed();
    displaySnake();
  };
  useInterval(moveSnake, 150);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  const isCollapsed = () => {
    let head = { ...snake[snake.length - 1] };

    for (let i = 0; i < snake.length - 3; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        setSnake({ x: 0, y: 0 }, { x: 1, y: 0 });
        alert(`game over: ${snake.length * 10}`);
        window.location.reload();
      }
    }
  };

  return (
    <div>
      <div style={{ display: "inline-flex" }}>
        <h2>Snake Game</h2>
        <Lottie options={defaultOptions} width={80} />
      </div>
      <ul>
        {rows?.map((innerRows, index) => (
          <li key={index} style={{ listStyle: "none" }}>
            {innerRows.map((row) => {
              switch (row) {
                case "blank":
                  return <img src={Blank} alt="blank" />;
                case "snake":
                  return <img src={Snake} alt="snake" />;
                case "food":
                  return <img src={Food} alt="Food" />;
                default:
                  // eslint-disable-next-line array-callback-return
                  return;
              }
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SnakeBoard;
