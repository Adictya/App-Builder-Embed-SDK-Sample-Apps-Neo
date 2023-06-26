export const refreshToken = async (apiKey, env) => {
  env ||= "staging";
  const data = await fetch(
    `https://managedservices-${env}.rteappbuilder.com/v1/token/generate`,
    {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
      },
    }
  ).then((res) => res.json());

  return data.token;
};

export const getABParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const join = urlParams.get("join");
  const id = urlParams.get("id");
  const uname = urlParams.get("uname");
  const env = urlParams.get("env");
  const apiKey = urlParams.get("apiKey");

  return {
    join,
    id,
    uname,
    env,
    apiKey,
  };
};
