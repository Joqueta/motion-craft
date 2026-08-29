import { describe, expect, it } from "./runner.js";
import { SkipLink } from "../components/fritzi/skip-link.js";

describe("SkipLink", () => {
  it("rend un lien vers #contenu avec le bon texte", () => {
    const link = SkipLink();
    expect(link.tagName).toBe("A");
    expect(link.className).toBe("skip-link");
    expect(link.getAttribute("href")).toBe("#contenu");
    expect(link.textContent).toBe("Aller au contenu principal");
  });
});
