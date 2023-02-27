import React from "react";
import { Component } from "@angular/core";
import AppBuilderWebSdk from "@appbuilder/web";

// Prevent dead code elimination on react
React.createElement("div");

@Component({
  selector: "app-root",
  template: `
    <div class="App">
      <div class="header">
        <span>My Angular App</span>
        <input id="meetingId" type="text" placeholder="Room id" />
        <button (click)="JoinMeeting()">Join</button>
      </div>
      <div style=" display: flex; flex: 1 ">
        <app-builder> </app-builder>
      </div>
    </div>
  `,
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "angular-app";

  unsubCreateEvent = () => {};
  unsubReadyToJoinEvent = () => {};
  unsubJoinEvent = () => {};
  unsubLeaveEvent = () => {};

  ngOnInit() {
    const myCustomization = AppBuilderWebSdk.createCustomization({
      // components:{
      //     videocall: () => <div>Hi</div>
      //   }
    });
    AppBuilderWebSdk.customize(myCustomization);

    this.unsubCreateEvent = AppBuilderWebSdk.on(
      "create",
      (hostMeetingId, attendeeMeetingId, pstnNumber) => {
        console.log("Angular Host App: Meeting created with", {
          hostMeetingId,
          attendeeMeetingId,
          pstnNumber,
        });
      }
    );
    this.unsubReadyToJoinEvent = AppBuilderWebSdk.on(
      "ready-to-join",
      (meetingTitle, deviceList) => {
        console.log("Angular Host App: precall with", {
          meetingTitle,
          deviceList,
        });
      }
    );
    this.unsubJoinEvent = AppBuilderWebSdk.on(
      "join",
      (meetingTitle, deviceList, isHost) => {
        console.log("Angular Host App: Meeting joined with", {
          meetingTitle,
          deviceList,
          isHost,
        });
      }
    );
    this.unsubLeaveEvent = AppBuilderWebSdk.on("leave", () => {
      console.log("Angular Host App: Meeting left");
    });
  }

  JoinMeeting() {
    AppBuilderWebSdk.join(
      (document.getElementById("meetingId") as HTMLInputElement).value!
    );
  }
  ngOnDestroy() {
    this.unsubCreateEvent();
    this.unsubReadyToJoinEvent();
    this.unsubJoinEvent();
    this.unsubLeaveEvent();
  }
}
