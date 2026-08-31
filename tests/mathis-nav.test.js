import { describe, expect, it } from "./runner.js";
import { Nav } from "../components/mathis/nav.js";

describe("Nav (mathis)", () => {
  it("retourne un fragment contenant le skip-link puis le header", () => {
    const fragment = Nav();

    expect(fragment.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
    expect(fragment.children.length).toBe(2);
    expect(fragment.children[0].className).toBe("skip-link");
    expect(fragment.children[0].getAttribute("href")).toBe("#contenu");
    expect(fragment.children[1].tagName).toBe("HEADER");
    expect(fragment.children[1].className).toBe("mathis-nav");
  });

  it("affiche le logo MV et les 4 liens de navigation", () => {
    const fragment = Nav();
    const header = fragment.children[1];

    expect(header.querySelector(".mathis-nav__logo").textContent).toBe("MV");

    const links = header.querySelectorAll(".mathis-nav__link");
    expect(links.length).toBe(4);
    expect(links[0].textContent).toBe("Accueil");
    expect(links[1].textContent).toBe("À propos");
    expect(links[2].textContent).toBe("Projets");
    expect(links[3].textContent).toBe("Contact");
  });

  it("marque le lien actif avec la classe is-active", () => {
    const links = [
      { label: "Accueil", href: "/mathis", dataRoute: false, active: true },
      { label: "À propos", href: "/mathis#apropos", dataRoute: false, active: false },
      { label: "Projets", href: "/mathis#projets", dataRoute: false, active: false },
      { label: "Contact", href: "/mathis#contact", dataRoute: false, active: false },
    ];
    const fragment = Nav({ links });
    const header = fragment.children[1];

    const active = header.querySelectorAll(".mathis-nav__link.is-active");
    expect(active.length).toBe(1);
    expect(active[0].textContent).toBe("Accueil");
  });
});
