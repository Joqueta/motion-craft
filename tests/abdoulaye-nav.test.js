import { describe, expect, it } from "./runner.js";
import { Nav } from "../components/abdoulaye/nav.js";

describe("Nav (abdoulaye)", () => {
  it("retourne un fragment contenant le skip-link puis le header", () => {
    const fragment = Nav();

    expect(fragment.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
    expect(fragment.children.length).toBe(2);
    expect(fragment.children[0].className).toBe("skip-link");
    expect(fragment.children[0].getAttribute("href")).toBe("#contenu");
    expect(fragment.children[1].tagName).toBe("HEADER");
    expect(fragment.children[1].className).toBe("abdoulaye-nav");
  });

  it("affiche les 4 liens de navigation et le bouton de contact", () => {
    const fragment = Nav();
    const header = fragment.children[1];

    const links = header.querySelectorAll(".abdoulaye-nav__link");
    expect(links.length).toBe(4);
    expect(header.querySelector(".abdoulaye-nav__cta").textContent).toBe("Me contacter");
  });

  it("marque le lien actif avec la classe is-active", () => {
    const links = [
      { label: "Accueil", href: "/abdoulaye", dataRoute: false, active: true },
      { label: "À propos", href: "/abdoulaye#about", dataRoute: false, active: false },
      { label: "Projets", href: "/abdoulaye/projets", dataRoute: false, active: false },
      { label: "Contact", href: "/abdoulaye/contact", dataRoute: false, active: false },
    ];
    const fragment = Nav({ links });
    const header = fragment.children[1];

    const active = header.querySelectorAll(".abdoulaye-nav__link.is-active");
    expect(active.length).toBe(1);
    expect(active[0].textContent).toBe("Accueil");
  });
});
