import React, { useReducer, useEffect } from "react";
import "./styles.css";
import Paddle from "./components/Paddle";
import Ball from "./components/Ball";
import Brick from "./components/Brick";

const initialState = {
  paddle1: {
    y: 0
  },
  paddle2: {
    y: 0
  },
  ball: {
    x: 50,
    y: 50,
    dx: 5,
    dy: 5
  },
  bricks: [{ x: 180, y: 110 }, { x: 180, y: 200 }]
};

function reducer(state, action) {
  switch (action.type) {
    case "MOVE_PADDLE_1":
      return { ...state, paddle1: action.payload };
    case "MOVE_PADDLE_2":
      return { ...state, paddle2: action.payload };
    case "MOVE_BALL":
      return { ...state, ball: action.payload };
    default:
      throw new Error();
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleKey(e) {
    const char = e.key.toLowerCase();
    if (char === "w" || char === "s") {
      dispatch({
        type: "MOVE_PADDLE_1",
        payload: {
          y: state.paddle1.y + (char === "w" ? -10 : 10)
        }
      });
    }
    if (char === "o" || char === "l") {
      dispatch({
        type: "MOVE_PADDLE_2",
        payload: {
          y: state.paddle2.y + (char === "o" ? -10 : 10)
        }
      });
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state]);

  function willCollide(rect1, rect2) {
    let x = false;
    let y = false;
    let xCurr = false;
    let yCurr = false;
    let collided = false;

    const rect1XNext = rect1.x + rect1.dx;
    const rect1YNext = rect1.y + rect1.dy;

    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x) {
      xCurr = true;
    }
    if (rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
      yCurr = true;
    }
    if (
      yCurr &&
      rect1XNext < rect2.x + rect2.width &&
      rect1XNext + rect1.width > rect2.x
    ) {
      x = true;
    }
    if (
      xCurr &&
      rect1YNext < rect2.y + rect2.height &&
      rect1YNext + rect1.height > rect2.y
    ) {
      y = true;
    }
    if (
      rect1XNext < rect2.x + rect2.width &&
      rect1XNext + rect1.width > rect2.x &&
      rect1YNext < rect2.y + rect2.height &&
      rect1YNext + rect1.height > rect2.y
    ) {
      collided = true;
    }
    return { x, y, collided };
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      let x = state.ball.x;
      let y = state.ball.y;
      let dx = state.ball.dx;
      let dy = state.ball.dy;

      let paddle1X = state.paddle1.y;
      let paddle2X = state.paddle2.y;

      const ball = {
        x,
        dx,
        y,
        dy,
        width: 20,
        height: 20
      };

      const walls = [
        // left
        {
          x: -100,
          y: 0,
          width: 100,
          height: 400
        },
        // right
        {
          x: 400,
          y: 0,
          width: 100,
          height: 400
        },
        // top
        {
          x: 0,
          y: -100,
          width: 400,
          height: 100
        },
        // bottom
        {
          x: 0,
          y: 300,
          width: 400,
          height: 100
        }
      ];

      const wallCollisions = walls.map(wall => {
        return willCollide(ball, wall);
      });

      if (wallCollisions[0].collided || wallCollisions[1].collided) {
        dx = -dx;
      }

      if (wallCollisions[2].collided || wallCollisions[3].collided) {
        dy = -dy;
      }

      const obstacleCols = [
        {
          left: paddle1X,
          top: 355
        },
        ...state.bricks
      ].map(ob => {
        return willCollide(ball, {
          width: 100,
          height: 25,
          x: ob.left,
          y: ob.top
        });
      });

      if (obstacleCols.some(obc => obc.y)) {
        dy = -dy;
      }
      if (obstacleCols.some(obc => obc.x)) {
        dx = -dx;
      }

      return dispatch({
        type: "MOVE_BALL",
        payload: {
          dx,
          dy,
          x: x + dx,
          y: y + dy
        }
      });
    }, 50);
    return () => clearTimeout(handle);
  }, [state.ball]);

  return (
    <div className="container">
      <Paddle paddleY={state.paddle1.y} />
      <Paddle isPlayerTwo paddleY={state.paddle2.y} />
      <Ball pos={state.ball} />
      {state.bricks.map(brick => (
        <Brick brick={brick} />
      ))}
    </div>
  );
}
