import { describe, expect, it } from "./runner.js";
import { Layout } from "../components/mathis/layout.js";

describe("Layout (mathis)", () => {
  it("ajoute la classe page--mathis au conteneur", () => {
    const root = Layout(document.createElement("div"));
    expect(root.className).toBe("page page--mathis");
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

  it("affiche le nom du profil dans le pied de page", () => {
    const root = Layout(document.createElement("div"), { firstName: "Mathis", lastName: "Vidueira" });

    const footerText = root.querySelector(".mathis-footer__text").textContent;
    expect(footerText).toContain("Mathis Vidueira");
    expect(footerText).toContain("Portfolio");
  });

  it("n'échoue pas si le profil est absent", () => {
    const root = Layout(document.createElement("div"));
    const footerText = root.querySelector(".mathis-footer__text").textContent;
    expect(footerText).toContain("Portfolio");
  });
});
