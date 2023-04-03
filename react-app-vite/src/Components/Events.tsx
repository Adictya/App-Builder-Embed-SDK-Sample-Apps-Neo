import React, { useEffect, useRef } from "react";
import AppBuilderReactSdk from "@appbuilder/react";
import { Log } from "../App";
import Panel from "./Panel";

export default function Events() {
  const eventUnsubscriptionEvents = useRef<any>([]);

  useEffect(() => {
    const unsubCreateEvent = AppBuilderReactSdk.on(
      "create",
      (hostMeetingId, attendeeMeetingId, pstnNumber) => {
        Log("React Host App: Meeting created with", {
          hostMeetingId,
          attendeeMeetingId,
          pstnNumber,
        });
      }
    );
    const unsubReadyToJoinEvent = AppBuilderReactSdk.on(
      "ready-to-join",
      (meetingTitle, deviceList) => {
        Log("React Host App: precall with", {
          meetingTitle,
          deviceList,
        });
      }
    );
    const unsubJoinEvent = AppBuilderReactSdk.on(
      "join",
      (meetingTitle, deviceList, isHost) => {
        Log("React Host App: joined with", {
          meetingTitle,
          deviceList,
          isHost,
        });
      }
    );

    const unsubLeaveEvent = AppBuilderReactSdk.on("leave", () => {
      // setInPrecall(false);
      Log("React Host App: left");
    });

    const rtcEvents = [
      AppBuilderReactSdk.on("_rtm-joined", (...params) => {
        Log("RTM USER JOINED", params);
      }),
      AppBuilderReactSdk.on("rtc-user-joined", (...params) => {
        Log("RTC USER JOINED", params);
      }),
      AppBuilderReactSdk.on("rtc-user-left", (...params) => {
        Log("RTC USER LEFT", params);
      }),
      AppBuilderReactSdk.on("rtc-user-unpublished", (...params) => {
        Log("RTC USER unpublished", params);
      }),
      AppBuilderReactSdk.on("rtc-user-published", (...params) => {
        Log("RTC USER published", params);
      }),
    ];

    eventUnsubscriptionEvents.current = [
      unsubCreateEvent,
      unsubReadyToJoinEvent,
      unsubJoinEvent,
      unsubLeaveEvent,
      ...rtcEvents,
    ];

    AppBuilderReactSdk.customEvents.on("MyEvent", (p) => {
      console.log("got my event", p);
    });

    AppBuilderReactSdk.customEvents.send("MyEvent", "onMount", 1);

    return () => {
      unsubCreateEvent();
      unsubReadyToJoinEvent();
      unsubJoinEvent();
      unsubLeaveEvent();
      rtcEvents.forEach((e) => e());
    };
  }, []);

  const unsubscribe = () => {
    eventUnsubscriptionEvents.current.forEach((element) => {
      if (element) {
        Log("elment", element);
        element();
      }
    });
  };

  return (
    <Panel title="Sdk events">
      <button
        onClick={() => {
          unsubscribe();
        }}
      >
        Unsubscribe
      </button>
    </Panel>
  );
}
