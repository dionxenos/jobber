const resolveBaseUrl = (): string => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5256/api/";
  }
  return "https://spirited-tranquility-production.up.railway.app/api/";
};

const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || resolveBaseUrl(),
};

export default config;
