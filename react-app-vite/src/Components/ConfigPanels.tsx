import React from "react";
import CustomEventsPanel from "./CustomEvents";
import DeviceSelection from "./DeviceSelection";
import Events from "./Events";
import JoinPanel from "./JoinPanel";
import LoginPanel from "./LoginPanel";
// import JoinOnMount from "./JoinOnMount";
import Component from "./MavtekTest";
import MuteParticipantPanel from "./MuteParticipantPanel";

export default function ConfigPanels() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#343233",
        color: "white",
        fontFamily: "sans-serif",
        overflowY: "scroll",
        height: "calc( 100vh - 3rem )",
      }}
    >
      <span style={{ textAlign: "center" }}>Scroll for more</span>
      <LoginPanel />
      <JoinPanel />
      <DeviceSelection />
      <MuteParticipantPanel />
      <Events />
      <CustomEventsPanel />
    </div>
  );
}
