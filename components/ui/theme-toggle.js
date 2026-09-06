import defineComponent from "../../lib/props.js";
import { applyTheme, nextTheme } from "../../lib/theme.js";
import portfolioStore from "../../store/portfolio-store.js";

const ICONS = {
  auto: "◐",
  light: "☀",
  dark: "☾",
};

const LABELS = {
  auto: `${ICONS.auto} Thème : système`,
  light: `${ICONS.light} Thème : clair`,
  dark: `${ICONS.dark} Thème : sombre`,
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
