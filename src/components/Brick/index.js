import React from "react";
import "./style.css";

export default function Brick({ brick }) {
  return (
    <div
      className="brick"
      style={{
        left: `${brick.x}px`,
        top: `${brick.y}px`
      }}
    />
  );
}
