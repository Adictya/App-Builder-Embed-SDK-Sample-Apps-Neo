import AppBuilderReactSdk from "@appbuilder/react";
import React, { useEffect } from "react";
import { Log } from "../App";
import Panel from "./Panel";

export default function CustomEventsPanel() {
  useEffect(() => {
    const unsub = [
      AppBuilderReactSdk.customEvents.on("MyEvent", (p) => {
        console.log("got my event", p);
      }),

      AppBuilderReactSdk.on("_rtm-joined", (...params) => {
        AppBuilderReactSdk.customEvents.send("MyEvent", "onRtmJoin", 1);
        Log("RTM USER JOINED", params);
      }),

      AppBuilderReactSdk.on("rtc-user-joined", (...params) => {
        AppBuilderReactSdk.customEvents.send("MyEvent", "onJoin", 1);
        Log("RTC USER JOINED", params);
      }),
    ];

    AppBuilderReactSdk.customEvents.send("MyEvent", "onMount", 1);

    return () => {
      unsub.forEach((p) => p());
    };
  });

  return (
    <Panel title="custom events">
      <button
        onClick={() => {
          AppBuilderReactSdk.customEvents.send("MyEvent", "hi", 1);
        }}
      >
        Test custom events
      </button>
    </Panel>
  );
}
