import { describe, expect, it } from "./runner.js";
import { A11yToggle, attachA11yToggle } from "../components/fritzi/a11y-toggle.js";

describe("A11yToggle", () => {
  it("rend un bouton avec aria-pressed=\"false\" et le libellé par défaut", () => {
    window.localStorage.removeItem("fritzi.a11y");
    const button = A11yToggle();
    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.getAttribute("aria-label")).toBe("Activer le mode accessibilité");
  });

  it("bascule aria-pressed et l'attribut data-a11y du conteneur au clic", () => {
    window.localStorage.removeItem("fritzi.a11y");
    const page = document.createElement("div");
    page.setAttribute("data-a11y", "off");
    const button = A11yToggle();
    page.appendChild(button);
    document.body.appendChild(page);

    button.click();

    expect(page.getAttribute("data-a11y")).toBe("on");
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("aria-label")).toBe("Désactiver le mode accessibilité");

    document.body.removeChild(page);
  });

  it("un second clic repasse à l'état désactivé", () => {
    window.localStorage.removeItem("fritzi.a11y");
    const page = document.createElement("div");
    page.setAttribute("data-a11y", "off");
    const button = A11yToggle();
    page.appendChild(button);
    document.body.appendChild(page);

    button.click();
    button.click();

    expect(page.getAttribute("data-a11y")).toBe("off");
    expect(button.getAttribute("aria-pressed")).toBe("false");

    document.body.removeChild(page);
  });

  it("persiste l'état dans localStorage après un clic", () => {
    window.localStorage.removeItem("fritzi.a11y");
    const page = document.createElement("div");
    page.setAttribute("data-a11y", "off");
    const button = A11yToggle();
    page.appendChild(button);
    document.body.appendChild(page);

    button.click();

    expect(window.localStorage.getItem("fritzi.a11y")).toBe("on");

    document.body.removeChild(page);
  });

  it("attachA11yToggle pose data-a11y selon l'état persisté et ajoute le bouton", () => {
    window.localStorage.setItem("fritzi.a11y", "on");
    const page = document.createElement("div");

    attachA11yToggle(page);

    expect(page.getAttribute("data-a11y")).toBe("on");
    expect(page.querySelector(".a11y-toggle")).toBeTruthy();
  });
});
