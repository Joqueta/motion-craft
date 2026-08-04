import { describe, expect, it } from "./runner.js";
import { HttpError, buildUrl, stringifyQuery } from "../lib/http.js";
import { flatten } from "../lib/cms.js";

describe("construction des requêtes", () => {
  it("sérialise une query plate", () => {
    expect(stringifyQuery({ sort: "name:asc" })).toEqual([["sort", "name:asc"]]);
  });

  it("sérialise une query imbriquée au format Strapi", () => {
    expect(stringifyQuery({ pagination: { pageSize: 100 } })).toEqual([
      ["pagination[pageSize]", "100"],
    ]);
  });

  it("sérialise un tableau avec index", () => {
    expect(stringifyQuery({ fields: ["id", "slug"] })).toEqual([
      ["fields[0]", "id"],
      ["fields[1]", "slug"],
    ]);
  });

  it("ignore les valeurs nulles", () => {
    expect(stringifyQuery({ tag: null, sort: "date:desc" })).toEqual([["sort", "date:desc"]]);
  });

  it("construit une URL sans query vide", () => {
    expect(buildUrl("http://localhost:1337/api/skills", {})).toBe("http://localhost:1337/api/skills");
  });

  it("ajoute la query à l'URL", () => {
    expect(buildUrl("http://localhost:1337/api/skills", { sort: "name:asc" })).toContain(
      "?sort=name%3Aasc",
    );
  });
});

describe("erreurs réseau", () => {
  it("expose le statut et l'URL", () => {
    const error = new HttpError("Ressource introuvable.", { status: 404, url: "/api/projects" });
    expect(error.status).toBe(404);
    expect(error.url).toBe("/api/projects");
    expect(error instanceof Error).toBeTruthy();
  });
});

describe("normalisation des réponses Strapi", () => {
  it("aplatit une collection", () => {
    const payload = {
      data: [{ id: 1, attributes: { name: "JavaScript", level: 4 } }],
      meta: { pagination: { page: 1 } },
    };
    expect(flatten(payload)).toEqual([{ id: 1, name: "JavaScript", level: 4 }]);
  });

  it("aplatit une relation imbriquée", () => {
    const payload = {
      data: {
        id: 3,
        attributes: {
          title: "Vanilla-Engine",
          image: { data: { id: 9, attributes: { url: "/uploads/a.png" } } },
        },
      },
    };
    expect(flatten(payload)).toEqual({
      id: 3,
      title: "Vanilla-Engine",
      image: { id: 9, url: "/uploads/a.png" },
    });
  });

  it("laisse les valeurs primitives intactes", () => {
    expect(flatten({ data: null })).toBe(null);
  });
});
