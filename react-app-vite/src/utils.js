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
