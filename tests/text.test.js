import { describe, expect, it } from "./runner.js";
import { escapeHtml } from "../lib/text.js";

describe("escapeHtml", () => {
  it("échappe les caractères HTML spéciaux", () => {
    expect(escapeHtml(`<img src=x onerror=alert(1)>&"'`)).toBe(
      "&lt;img src=x onerror=alert(1)&gt;&amp;&quot;&#39;",
    );
  });

  it("laisse le texte normal inchangé", () => {
    expect(escapeHtml("Aurora — Studio .decode")).toBe("Aurora — Studio .decode");
  });

  it("gère null et undefined comme une chaîne vide", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});
