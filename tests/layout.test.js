import { describe, expect, it } from "./runner.js";
import { Layout } from "../components/fritzi/layout.js";

describe("Layout (fritzi)", () => {
  it("ajoute le bouton d'accessibilité et l'attribut data-a11y au conteneur", () => {
    window.localStorage.removeItem("fritzi.a11y");
    const root = Layout(document.createElement("div"));

    expect(root.className).toContain("page--fritzi");
    expect(root.getAttribute("data-a11y")).toBe("off");
    expect(root.querySelector(".a11y-toggle")).toBeTruthy();
  });

  it("pose id=contenu et tabIndex=-1 sur le contenu quand c'est un élément unique", () => {
    const content = document.createElement("div");
    Layout(content);

    expect(content.id).toBe("contenu");
    expect(content.tabIndex).toBe(-1);
  });

  it("pose id=contenu et tabIndex=-1 sur le premier enfant quand le contenu est un fragment", () => {
    const fragment = document.createDocumentFragment();
    const first = document.createElement("section");
    const second = document.createElement("section");
    fragment.appendChild(first);
    fragment.appendChild(second);

    Layout(fragment);

    expect(first.id).toBe("contenu");
    expect(first.tabIndex).toBe(-1);
    expect(second.id).toBe("");
  });
});
