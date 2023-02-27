<template>
  <div class="App">
    <div class="header">
      <span>My Vue App</span>
      <input id="meetingId" type="text" placeholder="Room id" />
      <button @click="JoinMeeting()">Join</button>
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

let unsubCreateEvent = () => {};
let unsubReadyToJoinEvent = () => {};
let unsubJoinEvent = () => {};
let unsubLeaveEvent = () => {};

const myCustomization = AppBuilderWebSdk.createCustomization({
  components: {
    videoCall: () => <div>Hi</div>,
  },
});
AppBuilderWebSdk.customize(myCustomization);

export default {
  name: "App",
  methods: {
    JoinMeeting() {
      AppBuilderWebSdk.join(document.getElementById("meetingId").value);
    },
  },
  mounted() {
    (async () => {
      console.log("FuckYou");
      const meetingInfo2 = {
        channel: "e203e0453af1410982b9b89dcd8d81b4",
        encryptionSecret: "0b29fbcff24f43068a8a04277f6def90",
        isHost: true,
        meetingTitle: "Customization API improvements",
        rtmToken:
          "006b8c2ef0f986541a8992451c07d30fb4bIADAzh9FKAQ944qlu7UE4aR3mYPodXx4PYZM7s2haZKHnK/Uu98AAAAAEABzflkDd3H3YwEA6AN3cfdj",
        screenShareToken:
          "006b8c2ef0f986541a8992451c07d30fb4bIADJ2RkrwOv13jCPsNtyTpyVIL6fKA00rpwl6XDlc0jiZFXsbwGdN6usIgAD238Dd3H3YwQAAQB3cfdjAgB3cfdjAwB3cfdjBAB3cfdj",
        screenShareUid: 280999940,
        token:
          "006b8c2ef0f986541a8992451c07d30fb4bIADg5470ZJ5tFmefTeUwO3wyUA+VvLyeYZ7ulLsI5vY6kFXsbwGv1LvfIgDNQI4Cd3H3YwQAAQB3cfdjAgB3cfdjAwB3cfdjBAB3cfdj",
        uid: 220152809,
      };
      AppBuilderWebSdk.join(meetingInfo2);
    })();
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
  },
  unmounted() {
    unsubCreateEvent();
    unsubReadyToJoinEvent();
    unsubJoinEvent();
    unsubLeaveEvent();
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
