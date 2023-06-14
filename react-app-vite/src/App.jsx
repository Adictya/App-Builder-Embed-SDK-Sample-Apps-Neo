import React, { useEffect } from "react";
import "./app.css";
import AppBuilderReactSdk, {
  UiKitMaxVideoView,
  useLocalUserInfo,
  MaxVideoView,
} from "@appbuilder/react";
import ConfigPanels from "./Components/ConfigPanels";
import { Link } from "react-router-dom6";

export function Log(...args) {
  console.log("[React HOST App]: ", ...args);
}

const VideoView = () => {
  const localUserInfo = useLocalUserInfo();
  return (
    <UiKitMaxVideoView containerStyle={{ flex: 1 }} user={localUserInfo} />
  );
};

function App() {
  useEffect(() => {
    const myCustomization = AppBuilderReactSdk.createCustomization({
      components: {
        // precall: VideoView,
        // videoCall: VideoView,
        // precall: () => {
        //   const local = useLocalUserInfo();
        //   return <MaxVideoView user={local} />;
        // },
        // appRoot: () => <div>hi</div>,
        //   videoCall: () => <div>Hi</div>,
        //   bottomBar: () => <div>Hi</div>,
        //   bottombar: () => <div>Hi</div>,
        //   chat: () => <div>Hi</div>,
        //   topBar: () => <div>Hi</div>,
      },
    });

    AppBuilderReactSdk.customize(myCustomization);
  }, []);

  return (
    <div className="App">
      <div className="header">
        <span>My React App</span>
        <Link to="/test" style={{ color: "white" }}>
          Go to next page
        </Link>
      </div>
      <div
        style={{ position: "relative", display: "flex", maxHeight:'calc( 100vh - 3rem )'}}
      >
        <div style={{ display: "flex", flex: 1 }}>
          <AppBuilderReactSdk.View />
        </div>
        <div style={{ width: "20vw" }}>
          <ConfigPanels />
        </div>
      </div>
    </div>
  );
}

export default App;
