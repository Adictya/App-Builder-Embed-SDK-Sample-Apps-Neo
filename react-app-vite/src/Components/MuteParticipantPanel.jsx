import React, { useEffect, useMemo, useState } from "react";
import AppBuilderReactSdk from "@appbuilder/react";
import Panel from "./Panel";
import { Log } from "../App";

const MuteParticipantPanel = () => {
  const [participantMuted, setParticipantMuted] = useState(false);

  useEffect(() => {
    (async () => {
      await AppBuilderReactSdk.muteAllParticipants(true);
      setParticipantMuted(true);
    })();
  }, []);

  return (
    <Panel title="Mute Participant">
      <button
        style={{ backgroundColor: participantMuted ? "red" : undefined }}
        onClick={async () => {
          let state;
          await AppBuilderReactSdk.muteAllParticipants((p) => {
            Log('1',p);
            state = !p;
            return !p;
          });
          Log(state);
          setParticipantMuted(state);
        }}
      >
        Toggle Participant Audio
      </button>
    </Panel>
  );
};

export default MuteParticipantPanel;
