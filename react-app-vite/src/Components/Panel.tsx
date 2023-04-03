import React from "react";
export default function Panel(props) {
  return (
    <div
      style={{
        margin: "5px",
        border: "1px dashed white",
        padding: "2px",
        background: "#00000020",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ fontFamily: "sans-serif", margin: "2px", color: "white" }}>
        {props.title}
      </h3>
      {props.children}
    </div>
  );
}
