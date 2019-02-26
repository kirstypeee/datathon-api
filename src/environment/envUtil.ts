export const isDev = () => process.env.NODE_ENV === "development";

export const isStaging = () =>
  !isDev() && process.env.APPLICATION_ENVIRONMENT === "staging";

export const isProd = () => !isDev() && !isStaging();
