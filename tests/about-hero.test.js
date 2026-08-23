import { describe, expect, it } from "./runner.js";
import { AboutHero } from "../components/fritzi/about/about-hero.js";

function buildProps() {
  return {
    role: "Motion & Front-end Designer",
    locationLabel: "Basée à",
    location: "Paris, France",
    portrait: { url: "/assets/fritzi/about/hero-portrait.webp", alt: "Portrait de Fritzi Frois" },
    paragraphs: ["Une bio courte.", "Une deuxième ligne de bio."],
  };
}

describe("AboutHero", () => {
  it("rend le portrait avec le bon src et alt", () => {
    const section = AboutHero(buildProps());
    const img = section.querySelector(".about-hero__portrait");
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toBe("/assets/fritzi/about/hero-portrait.webp");
    expect(img.getAttribute("alt")).toBe("Portrait de Fritzi Frois");
  });

  it("inclut la fenêtre EyeReveal par-dessus le portrait", () => {
    const section = AboutHero(buildProps());
    expect(section.querySelector(".eye-reveal")).toBeTruthy();
  });

  it("lève une erreur si le portrait est manquant", () => {
    const props = buildProps();
    delete props.portrait;
    expect(() => AboutHero(props)).toThrow();
  });
});
