import { getA11yMode, setA11yMode, toggleA11yMode } from "../../lib/fritzi-a11y.js";

const LABEL = {
  on: "Désactiver le mode accessibilité",
  off: "Activer le mode accessibilité",
};

export function A11yToggle() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "a11y-toggle";

  button.addEventListener("click", () => {
    const container = button.closest("[data-a11y]");
    const current = container?.getAttribute("data-a11y") === "on" ? "on" : "off";
    const next = toggleA11yMode(current);

    if (container) container.setAttribute("data-a11y", next);
    setA11yMode(next);
    render(next);
  });

  function render(mode) {
    button.setAttribute("aria-pressed", mode === "on" ? "true" : "false");
    button.setAttribute("aria-label", LABEL[mode]);
    button.title = LABEL[mode];
    button.innerHTML = '<span aria-hidden="true">♿</span>';
  }

  render(getA11yMode());
  return button;
}

export function attachA11yToggle(page) {
  page.setAttribute("data-a11y", getA11yMode());
  page.appendChild(A11yToggle());
  return page;
}
