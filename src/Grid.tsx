import React, { FC, ReactNode } from "react";

const Grid:FC<{ size:number, children?: ReactNode }> = ({ size, children }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${size}, 10px [col-start])`, gridTemplateRows: `repeat(${size}, 10px [row-start])` }}>
    {children}
  </div>
)

export default Grid;