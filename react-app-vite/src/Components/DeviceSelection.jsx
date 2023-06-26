import React, { useEffect, useMemo, useState } from "react";
import AppBuilderReactSdk from "@appbuilder/react";
import JoinPanel from "./JoinPanel";
import Panel from "./Panel";
import { Log } from "../App";

const DeviceSelection = () => {
  const [devices, setDevices] = useState([]);
  const videoDevices = useMemo(() => {
    return devices.filter((device) => device.kind === "videoinput");
  }, [devices]);
  const audioDevices = useMemo(() => {
    return devices.filter((device) => device.kind === "audioinput");
  }, [devices]);
  const speakerDevices = useMemo(() => {
    return devices.filter((device) => device.kind === "audiooutput");
  }, [devices]);
  const [selectedCam, setSelectedCam] = useState("0");
  const [selectedMic, setSelectedMic] = useState("0");
  const [selectedSpeaker, setSelectedSpeaker] = useState("0");

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setDevices(devices);
      });
    });
    const unsub = [
      AppBuilderReactSdk.on("devices-selected-camera-changed", (deviceId) => {
        console.log("SDKEVENT: cam changed", deviceId);
        setSelectedCam(deviceId);
      }),
      AppBuilderReactSdk.on(
        "devices-selected-microphone-changed",
        (deviceId) => {
          console.log("SDKEVENT: mic changed", deviceId);
          setSelectedMic(deviceId);
        }
      ),
      AppBuilderReactSdk.on("devices-selected-speaker-changed", (deviceId) => {
        console.log("SDKEVENT: speaker changed", deviceId);
        setSelectedSpeaker(deviceId);
      }),
    ];

    return () => {
      unsub.forEach((p) => p());
    };
  }, []);

  return (
    <Panel title="Devices">
      <span>
        {videoDevices.find((d) => {
          return d.deviceId === selectedCam;
        })?.label ?? "Cam Not initialized"}
      </span>
      <select
        onChange={(e) => {
          AppBuilderReactSdk.setCamera(videoDevices[e.target.value].deviceId);
        }}
      >
        {videoDevices.map((e, i) => {
          return <option value={i}>{e.label}</option>;
        })}
      </select>
      <span>
        {audioDevices.find((d) => {
          return d.deviceId === selectedMic;
        })?.label ?? "Mic Not initialized"}
      </span>
      <select
        onChange={(e) => {
          AppBuilderReactSdk.setMicrophone(
            audioDevices[e.target.value].deviceId
          );
          setSelectedMic(e.target.value);
        }}
      >
        {audioDevices.map((e, i) => {
          return <option value={i}>{e.label}</option>;
        })}
      </select>
      <span>
        {speakerDevices.find((d) => {
          return d.deviceId === selectedSpeaker;
        })?.label ?? "Speaker not initialized"}
      </span>
      <select
        onChange={(e) => {
          AppBuilderReactSdk.setSpeaker(
            speakerDevices[e.target.value].deviceId
          );
        }}
      >
        {speakerDevices.map((e, i) => {
          return <option value={i}>{e.label}</option>;
        })}
      </select>
      <button
        onClick={() => {
          AppBuilderReactSdk.muteVideo((p) => !p);
        }}
      >
        Toggle Video
      </button>
      <button
        onClick={() => {
          AppBuilderReactSdk.muteAudio((p) => !p);
        }}
      >
        Toggle Audio
      </button>
    </Panel>
  );
};

export default DeviceSelection;
