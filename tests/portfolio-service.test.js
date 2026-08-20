import { describe, expect, it } from "./runner.js";
import { mediaUrl } from "../services/portfolio-service.js";

describe("mediaUrl", () => {
  it("préfixe une URL relative avec la base du client CMS", () => {
    expect(mediaUrl({ url: "/uploads/a.png" })).toBe("http://localhost:1337/uploads/a.png");
  });

  it("laisse une URL absolue inchangée", () => {
    expect(mediaUrl({ url: "https://cdn.example.com/a.png" })).toBe("https://cdn.example.com/a.png");
  });

  it("retourne une chaîne vide pour un média manquant", () => {
    expect(mediaUrl(null)).toBe("");
  });
});
