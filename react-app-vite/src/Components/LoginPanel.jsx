import React, { useRef, useState } from "react";
import { Log } from "../App";
import Panel from "./Panel";
import AppBuilderReactSdk from "@appbuilder/react";

const LoginPanel = () => {
  const isLoggedIn = useState(false);

  return (
    <Panel title="Auth Methods">
      <textarea id="tokenInput" placeholder="Token"></textarea>
      <button
        onClick={async () => {
          const value = document.getElementById("tokenInput").value;
          AppBuilderReactSdk.login(value);
        }}
      >
        Login with token
      </button>
      <button
        onClick={async () => {
          AppBuilderReactSdk.logout();
        }}
      >
        Logout
      </button>
    </Panel>
  );
};

export default LoginPanel;
