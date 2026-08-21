import { describe, expect, it } from "./runner.js";
import { AboutMe } from "../components/fritzi/home/about-me.js";

function buildProps() {
  return {
    heading: "About",
    quote: {
      lead: "Front-end",
      highlight1: "Front-end",
      connector: "and a",
      highlight2: "Back-end",
      tail: "upbringing.",
    },
    caption: "Une approche design guidée par la curiosité.",
    portrait: { url: "/assets/fritzi/home/about-me-bg.webp", alt: "Portrait de Fritzi Frois" },
  };
}

describe("AboutMe", () => {
  it("inclut la fenêtre EyeReveal par-dessus le portrait", () => {
    const section = AboutMe(buildProps());
    expect(section.querySelector(".eye-reveal")).toBeTruthy();
  });

  it("garde le portrait existant intact", () => {
    const section = AboutMe(buildProps());
    const img = section.querySelector(".about-me__portrait");
    expect(img.getAttribute("src")).toBe("/assets/fritzi/home/about-me-bg.webp");
  });
});
