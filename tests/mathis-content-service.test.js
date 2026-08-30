import { describe, expect, it } from "./runner.js";
import client from "../services/mathis-cms-client.js";
import { toImage, toProjectCard, fetchProjects, fetchProjectDetail } from "../services/mathis-content-service.js";

describe("mathis-content-service — mapping", () => {
  it("mappe une image absente", () => {
    expect(toImage(null)).toEqual({ url: "", alt: "" });
  });

  it("mappe une image avec URL relative", () => {
    const media = { url: "/uploads/a.svg", alternativeText: "Aperçu" };
    expect(toImage(media)).toEqual({ url: "http://localhost:1337/uploads/a.svg", alt: "Aperçu" });
  });

  it("mappe une carte projet complète", () => {
    const raw = {
      id: 1,
      slug: "wiki-cms-headless",
      title: "Wiki - CMS Headless",
      tags: ["PHP", "PostgreSQL", "SCSS"],
      excerpt: "CMS headless développé from scratch en PHP.",
      cover: { url: "/uploads/a.svg", alternativeText: "Aperçu" },
    };
    expect(toProjectCard(raw)).toEqual({
      id: 1,
      slug: "wiki-cms-headless",
      title: "Wiki - CMS Headless",
      tags: ["PHP", "PostgreSQL", "SCSS"],
      excerpt: "CMS headless développé from scratch en PHP.",
      cover: { url: "http://localhost:1337/uploads/a.svg", alt: "Aperçu" },
    });
  });

  it("mappe une carte projet sans champs optionnels", () => {
    const raw = { id: 2, slug: "devinsight", title: "devInsight" };
    expect(toProjectCard(raw)).toEqual({
      id: 2,
      slug: "devinsight",
      title: "devInsight",
      tags: [],
      excerpt: "",
      cover: { url: "", alt: "" },
    });
  });
});

describe("mathis-content-service — fetchProjects filtre sur l'état", () => {
  it("exclut les projets non publiés et envoie le filtre state=published, trié par order", async () => {
    const originalFind = client.find;
    let receivedResource = null;
    let receivedQuery = null;
    client.find = async (resource, query) => {
      receivedResource = resource;
      receivedQuery = query;
      const projects = [
        { id: 1, slug: "a", title: "A", cover: null, state: "published" },
        { id: 2, slug: "b", title: "B", cover: null, state: "draft" },
        { id: 3, slug: "c", title: "C", cover: null, state: "review" },
        { id: 4, slug: "d", title: "D", cover: null, state: "archived" },
      ];
      const wanted = query.filters?.state?.$eq;
      const items = wanted ? projects.filter((project) => project.state === wanted) : projects;
      return { items, pagination: null };
    };

    try {
      const result = await fetchProjects();
      expect(result.map((project) => project.slug)).toEqual(["a"]);
      expect(receivedResource).toBe("mathis-projects");
      expect(receivedQuery.filters.state.$eq).toBe("published");
      expect(receivedQuery.sort).toBe("order:asc");
    } finally {
      client.find = originalFind;
    }
  });
});

describe("mathis-content-service — fetchProjectDetail masque les projets non publiés", () => {
  it("lève une erreur pour un projet trouvé mais non publié", async () => {
    const originalFind = client.find;
    client.find = async (resource, query) => {
      if (query.filters?.slug) {
        return { items: [{ id: 9, slug: "brouillon", state: "draft" }], pagination: null };
      }
      return { items: [], pagination: null };
    };

    try {
      let thrown = null;
      try {
        await fetchProjectDetail("brouillon");
      } catch (error) {
        thrown = error;
      }
      expect(thrown).toBeTruthy();
      expect(thrown.message).toBe('Projet "brouillon" introuvable');
    } finally {
      client.find = originalFind;
    }
  });

  it("lève une erreur pour un slug absent (référence)", async () => {
    const originalFind = client.find;
    client.find = async () => ({ items: [], pagination: null });
    try {
      let thrown = null;
      try {
        await fetchProjectDetail("inexistant");
      } catch (error) {
        thrown = error;
      }
      expect(thrown.message).toBe('Projet "inexistant" introuvable');
    } finally {
      client.find = originalFind;
    }
  });

  it("lève une erreur si le slug n'est pas fourni", async () => {
    let thrown = null;
    try {
      await fetchProjectDetail("");
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeTruthy();
    expect(thrown.message).toBe("Slug de projet manquant");
  });
});
