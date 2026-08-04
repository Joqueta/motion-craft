import defineComponent from "../../lib/props.js";
import { applyTheme, nextTheme } from "../../lib/theme.js";
import portfolioStore from "../../store/portfolio-store.js";

const LABELS = {
  auto: "Thème : système",
  light: "Thème : clair",
  dark: "Thème : sombre",
};

const ICONS = {
  auto: "◐",
  light: "☀",
  dark: "☾",
};

const ThemeToggle = defineComponent("ThemeToggle", {}, () => {
  const theme = portfolioStore.get("theme");

  return {
    type: "button",
    attributes: [
      ["type", "button"],
      ["class", ["theme-toggle"]],
      ["aria-label", LABELS[theme]],
      ["title", LABELS[theme]],
    ],
    events: [["click", () => portfolioStore.set("theme", applyTheme(nextTheme(theme)))]],
    children: [ICONS[theme]],
  };
});

export default ThemeToggle;
