const DEFAULTS = {
  cmsUrl: "http://localhost:1337",
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
