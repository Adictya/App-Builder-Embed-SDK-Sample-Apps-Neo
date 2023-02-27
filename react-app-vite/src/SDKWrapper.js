import AppBuilderSdk from "@appbuilder/react";

function log(...args) {
  console.log("[React HOST App]: ", ...args);
}

export const fetchMeetingData = async (meetingId) => {
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

export const sdkJoin = async (meetingInfo, precallEnabled) => {
  let recievedMeetingData;
  let concurrencyTest = false;
  log("Attempting Join with ", meetingInfo);
  try {
    if (precallEnabled) {
      let stuff;
      concurrencyTest &&
        (stuff = await AppBuilderSdk.joinPrecall(
          "6359c478-9169-4942-9292-54cd44ea3f2c"
        ));
      stuff = await AppBuilderSdk.joinPrecall(meetingInfo);
      log("Pre successful with ", recievedMeetingData);
      recievedMeetingData = stuff[0];
      joinRoomRef.current = stuff[1];
    } else {
      concurrencyTest &&
        (recievedMeetingData = await AppBuilderSdk.joinRoom(
          "6359c478-9169-4942-9292-54cd44ea3f2c"
        ));
      log("Join successful with ", recievedMeetingData);
      recievedMeetingData = await AppBuilderSdk.joinRoom(meetingInfo);
    }
  } catch (error) {
    log("Join failed with", error);
  }
  return recievedMeetingData;
};

export const onMount = async () => {
  // sdkJoin("7c448c17-d515-4dfa-ba7a-10bac8d4c71d");
  const myCustomization = AppBuilderSdk.createCustomization({
    // components: {
    //   // appRoot: () => <div>hi</div>,
    //   videoCall: () => <div>Hi</div>,
    //   bottomBar: () => <div>Hi</div>,
    //   bottombar: () => <div>Hi</div>,
    //   chat: () => <div>Hi</div>,
    //   topBar: () => <div>Hi</div>,
    // },
  });

  AppBuilderSdk.customize(myCustomization);
  const unsubCreateEvent = AppBuilderSdk.on(
    "create",
    (hostMeetingId, attendeeMeetingId, pstnNumber) => {
      log("React Host App: Meeting created with", {
        hostMeetingId,
        attendeeMeetingId,
        pstnNumber,
      });
    }
  );
  const unsubReadyToJoinEvent = AppBuilderSdk.on(
    "ready-to-join",
    (meetingTitle, deviceList) => {
      log("React Host App: precall with", {
        meetingTitle,
        deviceList,
      });
    }
  );
  const unsubJoinEvent = AppBuilderSdk.on(
    "join",
    (meetingTitle, deviceList, isHost) => {
      log("React Host App: joined with", {
        meetingTitle,
        deviceList,
        isHost,
      });
    }
  );

  const unsubLeaveEvent = AppBuilderSdk.on("leave", () => {
    setInPrecall(false);
    log("React Host App: left");
  });

  // 'rtc-user-published': (uid: UidType, trackType: 'audio' | 'video') => void;
  // 'rtc-user-unpublished': (uid: UidType, trackType: 'audio' | 'video') => void;
  // 'rtc-user-joined': (uid: UidType) => void;
  // 'rtc-user-left': (uid: UidType) => void;

  const rtcEvents = [
    AppBuilderSdk.on("rtc-user-joined", (...params) => {
      log("RTC USER JOINED", params);
    }),
    AppBuilderSdk.on("rtc-user-left", (...params) => {
      log("RTC USER LEFT", params);
    }),
    AppBuilderSdk.on("rtc-user-unpublished", (...params) => {
      log("RTC USER unpublished", params);
    }),
    AppBuilderSdk.on("rtc-user-published", (...params) => {
      log("RTC USER published", params);
    }),
  ];

  let eventsUnsubs = [
    unsubCreateEvent,
    unsubReadyToJoinEvent,
    unsubJoinEvent,
    unsubLeaveEvent,
    ...rtcEvents,
  ];

  AppBuilderSdk.customEvents.on("MyEvent", () => {
    console.log("got my event");
  });

  return () => {
    unsubCreateEvent();
    unsubReadyToJoinEvent();
    unsubJoinEvent();
    unsubLeaveEvent();
    rtcEvents.forEach((e) => e());
  };
};
