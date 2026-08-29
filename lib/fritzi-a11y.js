const STORAGE_KEY = "fritzi.a11y";

export function getA11yMode() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on" ? "on" : "off";
  } catch {
    return "off";
  }
}

export function setA11yMode(mode) {
  const value = mode === "on" ? "on" : "off";
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage indisponible (navigation privée/quota) : le mode reste
    // appliqué pour la session en cours mais ne persiste pas
  }
  return value;
}

export function toggleA11yMode(current) {
  return current === "on" ? "off" : "on";
}
