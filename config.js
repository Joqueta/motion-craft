const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

const DEFAULTS = {
  cmsUrl: isLocalHost
    ? "http://localhost:1337"
    : "https://motion-craft-production-8226.up.railway.app",
  timeout: 8000,
  retries: 2,
  basePath: "",
  siteName: "Portfolio",
  storageKey: "portfolio.state",
  sessionKey: "portfolio.session",
};

function readOverrides() {
  try {
    return JSON.parse(window.localStorage.getItem("portfolio.config") ?? "{}");
  } catch {
    return {};
  }
}

const config = { ...DEFAULTS, ...readOverrides() };

export function updateConfig(partial) {
  Object.assign(config, partial);
  const overrides = { ...readOverrides(), ...partial };
  window.localStorage.setItem("portfolio.config", JSON.stringify(overrides));
}

export default config;
