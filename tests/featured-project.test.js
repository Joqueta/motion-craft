import { describe, expect, it } from "./runner.js";
import { FeaturedProjects } from "../components/fritzi/home/featured-project.js";

describe("FeaturedProjects", () => {
  it("affiche toujours l'image du cadre, avec rectangle.svg par défaut", () => {
    const section = FeaturedProjects({ projects: [] });

    const img = section.querySelector(".featured__frame-image");
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toBe("/assets/fritzi/home/rectangle.svg");
  });

  it("garde les espaceurs décoratifs (heading + grille)", () => {
    const section = FeaturedProjects({ projects: [] });

    expect(section.querySelector(".featured__frame")).toBeTruthy();
    expect(section.querySelector(".featured__grid-frame")).toBeTruthy();
  });

  it("bascule vers logo-cadre-white.svg au premier survol", () => {
    const section = FeaturedProjects({ projects: [] });
    document.body.appendChild(section);
    const img = section.querySelector(".featured__frame-image");

    expect(img.getAttribute("src")).toBe("/assets/fritzi/home/rectangle.svg");
    img.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(img.getAttribute("src")).toBe("/assets/fritzi/home/logo-cadre-white.svg");

    document.body.removeChild(section);
  });

  it("reste sur logo-cadre-white.svg même après un mouseleave (pas de retour en arrière)", () => {
    const section = FeaturedProjects({ projects: [] });
    document.body.appendChild(section);
    const img = section.querySelector(".featured__frame-image");

    img.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    img.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    expect(img.getAttribute("src")).toBe("/assets/fritzi/home/logo-cadre-white.svg");

    document.body.removeChild(section);
  });

  it("bascule aussi au premier tap (pointerdown), pour le tactile", () => {
    const section = FeaturedProjects({ projects: [] });
    document.body.appendChild(section);
    const img = section.querySelector(".featured__frame-image");

    img.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    expect(img.getAttribute("src")).toBe("/assets/fritzi/home/logo-cadre-white.svg");

    document.body.removeChild(section);
  });
});
