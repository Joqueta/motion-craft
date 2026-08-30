import { describe, expect, it } from "./runner.js";
import { Layout } from "../components/abdoulaye/layout.js";

describe("Layout (abdoulaye)", () => {
  it("ajoute la classe page--abdoulaye au conteneur", () => {
    const root = Layout(document.createElement("div"));
    expect(root.className).toBe("page page--abdoulaye");
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

  it("affiche le nom et l'email du profil dans le pied de page", () => {
    const root = Layout(document.createElement("div"), {
      firstName: "Abdoulaye",
      lastName: "Diagne",
      email: "abdoulayediagne049@gmail.com",
      github: "https://github.com/abdoulayediagne-lab",
    });

    const footerText = root.querySelector(".abdoulaye-footer__text").textContent;
    expect(footerText).toContain("Abdoulaye Diagne");
    expect(root.querySelector(".abdoulaye-footer__links a[href^='mailto:']").textContent).toBe(
      "abdoulayediagne049@gmail.com",
    );
  });
});
