const STORAGE_KEY = "portfolio.theme";
export const THEMES = ["auto", "light", "dark"];

export function currentTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : "light";
  } catch {
    return "light";
  }
}

export function applyTheme(theme) {
  const value = THEMES.includes(theme) ? theme : "auto";
  if (value === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", value);
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    return value;
  }
  return value;
}

export function nextTheme(theme) {
  return THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
}
