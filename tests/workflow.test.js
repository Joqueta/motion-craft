import { describe, expect, it } from "./runner.js";
import { STATE_VALUES, isPublic, publicProjects, stateLabel } from "../data/workflow.js";
import { MAX_ENTRIES, RETENTION_DAYS, appendEntry, pruneEntries } from "../lib/audit.js";
import { nextTheme } from "../lib/theme.js";

describe("workflow éditorial", () => {
  it("expose les quatre états du cahier des charges", () => {
    expect(STATE_VALUES).toEqual(["draft", "review", "published", "archived"]);
  });

  it("ne rend public que l'état publié", () => {
    expect(isPublic("published")).toBeTruthy();
    expect(isPublic("draft")).toBeFalsy();
    expect(isPublic("review")).toBeFalsy();
    expect(isPublic("archived")).toBeFalsy();
  });

  it("filtre les projets visibles sur le site", () => {
    const projects = [
      { id: 1, state: "published" },
      { id: 2, state: "draft" },
      { id: 3, state: "archived" },
      { id: 4, state: "published" },
    ];
    expect(publicProjects(projects).map((project) => project.id)).toEqual([1, 4]);
  });

  it("libelle un état inconnu en brouillon", () => {
    expect(stateLabel("inconnu")).toBe("Brouillon");
    expect(stateLabel("review")).toBe("Prêt à relire");
  });
});

describe("journal d'audit", () => {
  it("ajoute une entrée horodatée en tête", () => {
    const entries = appendEntry([], { action: "Publication", author: "abdoulaye" }, 1000);
    expect(entries.length).toBe(1);
    expect(entries[0].action).toBe("Publication");
    expect(entries[0].author).toBe("abdoulaye");
    expect(entries[0].at).toBe(1000);
  });

  it("purge les entrées au-delà de la durée de conservation", () => {
    const now = Date.now();
    const old = now - (RETENTION_DAYS + 1) * 24 * 60 * 60 * 1000;
    const entries = pruneEntries([{ at: now, action: "récent" }, { at: old, action: "ancien" }], now);
    expect(entries.length).toBe(1);
    expect(entries[0].action).toBe("récent");
  });

  it("plafonne le nombre d'entrées conservées", () => {
    const now = Date.now();
    const many = Array.from({ length: MAX_ENTRIES + 20 }, () => ({ at: now, action: "action" }));
    expect(pruneEntries(many, now).length).toBe(MAX_ENTRIES);
  });
});

describe("thème", () => {
  it("fait défiler système, clair puis sombre", () => {
    expect(nextTheme("auto")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("auto");
  });
});
