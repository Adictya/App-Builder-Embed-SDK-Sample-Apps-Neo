<template>
  <div class="App">
    <div class="header">
      <span>My Vue App</span>
      <input id="meetingId" type="text" placeholder="Room id" />
      <button @click="JoinRoomWithPhrase()">JoinRoomWithPhrase</button>
      <button @click="JoinRoomWithData()">JoinRoomWithData</button>
      <button @click="JoinPrecallWithPhrase()">JoinPrecallWithPhrase</button>
      <button @click="JoinPrecallWithData()">JoinPrecallWithData</button>
      <button @click="PrecallJoin()">PrecallJoin</button>
      <button @click="CustomEventsTest()">CustomEventsTest</button>
    </div>
    <div style="display: flex; flex: 1">
      <app-builder> </app-builder>
    </div>
  </div>
</template>

<script>
import "./app.css";
import AppBuilderWebSdk from "@appbuilder/web";
// eslint-disable-next-line
import React from "react";
// To prevent react getting removed in dead code elimination step;
React.createElement("div");

function log(...args) {
  console.log("[React HOST App]: ", ...args);
}

let unsubCreateEvent = () => {};
let unsubReadyToJoinEvent = () => {};
let unsubJoinEvent = () => {};
let unsubLeaveEvent = () => {};
let rtcEvents = [];

let joinRoomFromPrecall = () => {};

const myCustomization = AppBuilderWebSdk.createCustomization({
  components: {
    // videoCall: () => <div>Hi</div>,
  },
});
AppBuilderWebSdk.customize(myCustomization);

const sdkJoin = async (meetingInfo, precallEnabled) => {
  let recievedMeetingData;
  let concurrencyTest = false;
  log("Attempting Join with ", meetingInfo);
  try {
    if (precallEnabled) {
      let stuff;
      concurrencyTest &&
        (stuff = await AppBuilderWebSdk.joinPrecall(
          "6359c478-9169-4942-9292-54cd44ea3f2c"
        ));
      stuff = await AppBuilderWebSdk.joinPrecall(meetingInfo);
      log("Pre successful with ", recievedMeetingData);
      recievedMeetingData = stuff[0];
      joinRoomFromPrecall = stuff[1];
      setInPrecall(true);
    } else {
      concurrencyTest &&
        (recievedMeetingData = await AppBuilderWebSdk.joinRoom(
          "6359c478-9169-4942-9292-54cd44ea3f2c"
        ));
      log("Join successful with ", recievedMeetingData);
      recievedMeetingData = await AppBuilderWebSdk.joinRoom(meetingInfo);
      setInPrecall(false);
    }
  } catch (error) {
    log("Join failed with", error);
  }
  return recievedMeetingData;
};

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

export default {
  name: "App",
  methods: {
    JoinMeeting() {
      AppBuilderWebSdk.join(document.getElementById("meetingId").value);
    },
    async JoinRoomWithPhrase() {
      const meetingId = document.getElementById("meetingId").value;
      await sdkJoin(meetingId, false);
    },
    async JoinRoomWithData() {
      const meetingId = document.getElementById("meetingId").value;
      const data = await fetchMeetingData(meetingId);
      await sdkJoin(data, false);
    },
    async JoinPrecallWithPhrase() {
      const meetingId = document.getElementById("meetingId").value;
      await sdkJoin(meetingId, true);
    },
    async JoinPrecallWithData() {
      const meetingId = document.getElementById("meetingId").value;
      const data = await fetchMeetingData(meetingId);
      await sdkJoin(data, true);
    },
    PrecallJoin() {
      joinRoomFromPrecall();
    },
    CustomEventsTest() {
      AppBuilderWebSdk.customEvents.send("MyEvent", "hi", 1);
    },
  },
  mounted() {
    unsubCreateEvent = AppBuilderWebSdk.on(
      "create",
      (hostMeetingId, attendeeMeetingId, pstnNumber) => {
        console.log("Vue Host App: Meeting created with", {
          hostMeetingId,
          attendeeMeetingId,
          pstnNumber,
        });
      }
    );
    unsubReadyToJoinEvent = AppBuilderWebSdk.on(
      "ready-to-join",
      (meetingTitle, deviceList) => {
        console.log("Vue Host App: precall with", {
          meetingTitle,
          deviceList,
        });
      }
    );
    unsubJoinEvent = AppBuilderWebSdk.on(
      "join",
      (meetingTitle, deviceList, isHost) => {
        console.log("Vue Host App: Meeting joined with", {
          meetingTitle,
          deviceList,
          isHost,
        });
      }
    );
    unsubLeaveEvent = AppBuilderWebSdk.on("leave", () => {
      console.log("Vue Host App: Meeting left");
    });

    rtcEvents = [
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
    AppBuilderReactSdk.customEvents.on("MyEvent", () => {
      console.log("got my event");
    });
  },

  unmounted() {
    unsubCreateEvent();
    unsubReadyToJoinEvent();
    unsubJoinEvent();
    unsubLeaveEvent();
    rtcEvents.forEach((e) => e());
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
