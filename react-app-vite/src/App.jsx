import React, { useEffect, useRef, useState } from "react";
import "./app.css";
import AppBuilderReactSdk from "@appbuilder/react";

// AppBuilderReactSdk.join("7c448c17-d515-4dfa-ba7a-10bac8d4c71d");

function log(...args) {
  console.log("[React HOST App]: ", ...args);
}

function App() {
  const eventUnsubscriptionEvents = useRef([]);
  const joinRoomRef = useRef(() => {});

  const fetchMeetingData = async (meetingId) => {
    const response = await fetch(
      "https://cryptic-dawn-34132.herokuapp.com/query",
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,hi;q=0.8",
          "content-type": "application/json",
          "sec-ch-ua":
            '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
        },
        referrer: "http://localhost:5173/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: `{"operationName":"JoinChannel","variables":{"passphrase":"${meetingId}"},"query":"query JoinChannel($passphrase: String!) {\\n  joinChannel(passphrase: $passphrase) {\\n    channel\\n    title\\n    isHost\\n    secret\\n    mainUser {\\n      rtc\\n      rtm\\n      uid\\n      __typename\\n    }\\n    screenShare {\\n      rtc\\n      rtm\\n      uid\\n      __typename\\n    }\\n    __typename\\n  }\\n}"}`,
        method: "POST",
        mode: "cors",
        credentials: "omit",
      }
    );
    let data = await response.json();
    data = data.data;
    log("Got this", data);
    let meetingInfo = {};
    if (data?.joinChannel?.channel) {
      meetingInfo.channel = data.joinChannel.channel;
    }
    if (data?.joinChannel?.mainUser?.uid) {
      meetingInfo.uid = data.joinChannel.mainUser.uid;
    }
    if (data?.joinChannel?.mainUser?.rtc) {
      meetingInfo.token = data.joinChannel.mainUser.rtc;
    }
    if (data?.joinChannel?.mainUser?.rtm) {
      meetingInfo.rtmToken = data.joinChannel.mainUser.rtm;
    }
    if (data?.joinChannel?.secret) {
      meetingInfo.encryptionSecret = data.joinChannel.secret;
    }
    if (data?.joinChannel?.screenShare?.uid) {
      meetingInfo.screenShareUid = data.joinChannel.screenShare.uid;
    }
    if (data?.joinChannel?.screenShare?.rtc) {
      meetingInfo.screenShareToken = data.joinChannel.screenShare.rtc;
    }
    if (data?.joinChannel?.isHost) {
      meetingInfo.isHost = data.joinChannel.isHost;
    }
    if (data?.joinChannel?.title) {
      meetingInfo.meetingTitle = data.joinChannel.title;
    }

    return meetingInfo;
  };

  const sdkJoin = async (meetingInfo, precallEnabled) => {
    let recievedMeetingData;
    let concurrencyTest = false;
    log("Attempting Join with ", meetingInfo);
    try {
      if (precallEnabled) {
        let stuff;
        concurrencyTest &&
          (stuff = await AppBuilderReactSdk.joinPrecall(
            "6359c478-9169-4942-9292-54cd44ea3f2c"
          ));
        stuff = await AppBuilderReactSdk.joinPrecall(meetingInfo);
        log("Pre successful with ", recievedMeetingData);
        recievedMeetingData = stuff[0];
        joinRoomRef.current = stuff[1];
      } else {
        concurrencyTest &&
          (recievedMeetingData = await AppBuilderReactSdk.joinRoom(
            "6359c478-9169-4942-9292-54cd44ea3f2c"
          ));
        log("Join successful with ", recievedMeetingData);
        recievedMeetingData = await AppBuilderReactSdk.joinRoom(meetingInfo);
      }
    } catch (error) {
      log("Join failed with", error);
    }
    return recievedMeetingData;
  };

  useEffect(() => {
    // sdkJoin("7c448c17-d515-4dfa-ba7a-10bac8d4c71d");
    const myCustomization = AppBuilderReactSdk.createCustomization({
      // components: {
      //   // appRoot: () => <div>hi</div>,
      //   videoCall: () => <div>Hi</div>,
      //   bottomBar: () => <div>Hi</div>,
      //   bottombar: () => <div>Hi</div>,
      //   chat: () => <div>Hi</div>,
      //   topBar: () => <div>Hi</div>,
      // },
    });

    AppBuilderReactSdk.customize(myCustomization);
    const unsubCreateEvent = AppBuilderReactSdk.on(
      "create",
      (hostMeetingId, attendeeMeetingId, pstnNumber) => {
        log("React Host App: Meeting created with", {
          hostMeetingId,
          attendeeMeetingId,
          pstnNumber,
        });
      }
    );
    const unsubReadyToJoinEvent = AppBuilderReactSdk.on(
      "ready-to-join",
      (meetingTitle, deviceList) => {
        log("React Host App: precall with", {
          meetingTitle,
          deviceList,
        });
      }
    );
    const unsubJoinEvent = AppBuilderReactSdk.on(
      "join",
      (meetingTitle, deviceList, isHost) => {
        log("React Host App: joined with", {
          meetingTitle,
          deviceList,
          isHost,
        });
      }
    );

    const unsubLeaveEvent = AppBuilderReactSdk.on("leave", () => {
      setInPrecall(false);
      log("React Host App: left");
    });

    // 'rtc-user-published': (uid: UidType, trackType: 'audio' | 'video') => void;
    // 'rtc-user-unpublished': (uid: UidType, trackType: 'audio' | 'video') => void;
    // 'rtc-user-joined': (uid: UidType) => void;
    // 'rtc-user-left': (uid: UidType) => void;

    const rtcEvents = [
      AppBuilderReactSdk.on("rtc-user-joined", (...params) => {
        log("RTC USER JOINED", params);
      }),
      AppBuilderReactSdk.on("rtc-user-left", (...params) => {
        log("RTC USER LEFT", params);
      }),
      AppBuilderReactSdk.on("rtc-user-unpublished", (...params) => {
        log("RTC USER unpublished", params);
      }),
      AppBuilderReactSdk.on("rtc-user-published", (...params) => {
        log("RTC USER published", params);
      }),
    ];

    eventUnsubscriptionEvents.current = [
      unsubCreateEvent,
      unsubReadyToJoinEvent,
      unsubJoinEvent,
      unsubLeaveEvent,
      ...rtcEvents,
    ];
    AppBuilderReactSdk.customEvents.on("MyEvent", () => {
      console.log("got my event");
    });

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
        log("elment", element);
        element();
      }
    });
  };

  return (
    <div className="App">
      <div className="header">
        <span>My React App</span>
        <input id="meetingId" type="text" placeholder="Room id"></input>
        <button
          onClick={async () => {
            const value = document.getElementById("meetingId").value;
            await sdkJoin(value, true);
          }}
        >
          JoinPrecall with phrase
        </button>
        <button
          onClick={async () => {
            const value = document.getElementById("meetingId").value;
            const meetingData = await fetchMeetingData(value);
            await sdkJoin(meetingData, true);
          }}
        >
          JoinPrecall With data
        </button>
        <button
          onClick={async () => {
            const value = document.getElementById("meetingId").value;
            await sdkJoin(value, false);
          }}
        >
          JoinRoom with phrase
        </button>
        <button
          onClick={async () => {
            const value = document.getElementById("meetingId").value;
            const meetingData = await fetchMeetingData(value);
            await sdkJoin(meetingData, false);
          }}
        >
          JoinRoom With data
        </button>
        <button
          onClick={() => {
            sdkJoin({ garbage: "data" });
          }}
        >
          Join With garbage data
        </button>
        <button
          onClick={() => {
            joinRoomRef.current();
          }}
        >
          Join Room from Precall
        </button>
        <button onClick={unsubscribe}>Unsubscribe</button>
        <button
          onClick={() => {
            AppBuilderReactSdk.customEvents.send("MyEvent", "hi", 1);
          }}
        >
          Test custom events
        </button>
      </div>
      <div style={{ display: "flex", flex: 1, maxHeight: "100vh" }}>
        <AppBuilderReactSdk.View />
      </div>
    </div>
  );
}

export default App;
