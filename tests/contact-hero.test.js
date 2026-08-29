import { describe, expect, it } from "./runner.js";
import { ContactHero } from "../components/fritzi/contact/contact-hero.js";

describe("ContactHero", () => {
  it("rend un <h1> visuellement masqué avec le texte \"Come say hi\"", () => {
    const section = ContactHero({ portrait: { url: "/portrait.webp", alt: "Portrait" } });
    const heading = section.querySelector("h1");

    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe("Come say hi");
    expect(heading.className).toBe("visually-hidden");
  });
});
