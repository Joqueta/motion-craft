import { describe, expect, it } from "./runner.js";
import { getA11yMode, setA11yMode, toggleA11yMode } from "../lib/fritzi-a11y.js";

describe("fritzi-a11y", () => {
  it("renvoie \"off\" par défaut quand rien n'est stocké", () => {
    window.localStorage.removeItem("fritzi.a11y");
    expect(getA11yMode()).toBe("off");
  });

  it("renvoie \"off\" si la valeur stockée est invalide", () => {
    window.localStorage.setItem("fritzi.a11y", "n'importe quoi");
    expect(getA11yMode()).toBe("off");
  });

  it("setA11yMode persiste \"on\" et getA11yMode le relit", () => {
    setA11yMode("on");
    expect(getA11yMode()).toBe("on");
  });

  it("setA11yMode normalise toute valeur différente de \"on\" en \"off\"", () => {
    setA11yMode("yolo");
    expect(getA11yMode()).toBe("off");
  });

  it("toggleA11yMode inverse l'état", () => {
    expect(toggleA11yMode("on")).toBe("off");
    expect(toggleA11yMode("off")).toBe("on");
  });
});
