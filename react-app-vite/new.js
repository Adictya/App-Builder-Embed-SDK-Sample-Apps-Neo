import _ from "lodash";

const mediaTrack = await navigator.mediaDevices.getUserMedia({ audio: true });

const mediaDevices = await navigator.mediaDevices.enumerateDevices();

const oldStuff = {
  mediaTrack,
  mediaDevices,
};

const newStuff = _.cloneDeep(oldStuff);

console.log(newStuff);
console.log(oldStuff);
