import React, { useEffect, useRef, useState } from "react";
import { Log } from "../App";
import Panel from "./Panel";
import AppBuilderReactSdk from "@appbuilder/react";
import { getABParams, refreshToken } from "../utils";

const LoginPanel = () => {
  const disabled = true
  useEffect(() => {
    const { apiKey, env } = getABParams();
    document.getElementById("apiKey").value = apiKey;
    document.getElementById("env").value = env;
  }, []);
  return (
    <Panel title="Auth Methods">
      <input
        disabled={disabled}
        id="apiKey"
        type="text"
        placeholder="Api-Key"
      ></input>
      <input
        disabled={disabled}
        id="env"
        type="text"
        placeholder="Env (ex: staging(default), prod, preprod)"
      ></input>
      <button
        disabled={disabled}
        onClick={async () => {
          const apiKey = document.getElementById("apiKey").value;
          const env = document.getElementById("env").value;
          const value = await refreshToken(apiKey, env);
          document.getElementById("tokenInput").value = value;
        }}
      >
        Fetch Token
      </button>
      <span style={{ textAlign: "center" }}>-- or/and --</span>
      <textarea id="tokenInput" placeholder="Token"></textarea>
      <button
        disabled={disabled}
        onClick={async () => {
          let value = document.getElementById("tokenInput").value;
          AppBuilderReactSdk.login(value);
        }}
      >
        Login
      </button>
      <button
        disabled={disabled}
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
