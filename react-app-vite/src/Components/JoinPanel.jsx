import React, { useRef } from "react";
import { Log } from "../App";
import Panel from "./Panel";
import AppBuilderReactSdk from "@appbuilder/react";

const JoinPanel = () => {
  const joinRoomRef = useRef(() => {});
  const joinDataRef = useRef(null);

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

    Log("Got this", meetingInfo);
    return meetingInfo;
  };

  const sdkJoin = async (meetingInfo, precallEnabled) => {
    let recievedMeetingData;
    let concurrencyTest = false;
    Log("Attempting Join with ", meetingInfo);
    try {
      if (precallEnabled) {
        let stuff;
        concurrencyTest &&
          (stuff = await AppBuilderReactSdk.joinPrecall(
            "6359c478-9169-4942-9292-54cd44ea3f2c"
          ));
        stuff = await AppBuilderReactSdk.joinPrecall(meetingInfo);
        Log("Pre successful with ", recievedMeetingData);
        recievedMeetingData = stuff[0];
        joinRoomRef.current = stuff[1];
      } else {
        concurrencyTest &&
          (recievedMeetingData = await AppBuilderReactSdk.joinRoom(
            "6359c478-9169-4942-9292-54cd44ea3f2c"
          ));
        Log("Join successful with ", recievedMeetingData);
        recievedMeetingData = await AppBuilderReactSdk.joinRoom(meetingInfo);
      }
    } catch (error) {
      Log("Join failed with", error);
    }
    return recievedMeetingData;
  };

  return (
    <Panel title="Join Methods">
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
          joinDataRef.current = meetingData;
          await sdkJoin(meetingData, true);
          console.log("[!!!]: Precall join successful");
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
          const meetingData =
            joinDataRef.current || (await fetchMeetingData(value));
          await sdkJoin(meetingData, false);
        }}
      >
        JoinRoom With data
      </button>
      <button
        onClick={() => {
          sdkJoin({ garbage: "data" }, false);
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
    </Panel>
  );
};

export default JoinPanel;
