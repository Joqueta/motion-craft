import { describe, expect, it } from "./runner.js";
import client from "../services/cms-client.js";
import {
  toOffering,
  toProjectCard,
  toTextImageBlock,
  fetchWorkData,
  fetchHomeData,
  fetchProjectDetail,
} from "../services/fritzi-content-service.js";

describe("fritzi-content-service — mapping", () => {
  it("mappe un offering complet", () => {
    const raw = {
      id: 1,
      number: "01",
      title: "Front-end",
      tag: "Related work",
      tools: "HTML, CSS, JS",
      work: ["TV display"],
      relatedWork: [{ label: "Tv display", slug: "decode-tv-display" }],
    };
    expect(toOffering(raw)).toEqual({
      id: 1,
      number: "01",
      title: "Front-end",
      tag: "Related work",
      tools: "HTML, CSS, JS",
      work: ["TV display"],
      relatedWork: [{ label: "Tv display", slug: "decode-tv-display" }],
    });
  });

  it("mappe un offering sans work ni relatedWork", () => {
    const raw = { id: 2, number: "02", title: "Back-end", tools: "PHP" };
    expect(toOffering(raw)).toEqual({
      id: 2,
      number: "02",
      title: "Back-end",
      tag: "",
      tools: "PHP",
      work: [],
      relatedWork: [],
    });
  });

  it("mappe une carte projet avec image relative", () => {
    const raw = { id: 5, slug: "aurora", client: ".decode", label: "TV display", cover: { url: "/uploads/a.png", alternativeText: "Aperçu" } };
    expect(toProjectCard(raw)).toEqual({
      id: 5,
      slug: "aurora",
      client: ".decode",
      label: "TV display",
      cover: { url: "http://localhost:1337/uploads/a.png", alt: "Aperçu" },
    });
  });

  it("mappe un bloc texte+image sans image", () => {
    const raw = { eyebrow: "Discovery", heading: "Titre", paragraphs: ["p1"] };
    expect(toTextImageBlock(raw)).toEqual({
      eyebrow: "Discovery",
      heading: "Titre",
      paragraphs: ["p1"],
      image: { url: "", alt: "" },
    });
  });
});

describe("fritzi-content-service — fetchWorkData filtre sur l'état", () => {
  it("exclut les projets non publiés et envoie le filtre state=published", async () => {
    const originalFind = client.find;
    let receivedQuery = null;
    client.find = async (resource, query) => {
      receivedQuery = query;
      const projects = [
        { id: 1, slug: "a", client: "X", label: "A", cover: null, state: "published" },
        { id: 2, slug: "b", client: "X", label: "B", cover: null, state: "draft" },
        { id: 3, slug: "c", client: "X", label: "C", cover: null, state: "review" },
        { id: 4, slug: "d", client: "X", label: "D", cover: null, state: "archived" },
      ];
      const wanted = query.filters?.state?.$eq;
      const items = wanted ? projects.filter((project) => project.state === wanted) : projects;
      return { items, pagination: null };
    };

    try {
      const result = await fetchWorkData();
      expect(result.map((project) => project.slug)).toEqual(["a"]);
      expect(receivedQuery.filters.state.$eq).toBe("published");
    } finally {
      client.find = originalFind;
    }
  });
});

describe("fritzi-content-service — fetchHomeData filtre featured + published", () => {
  it("combine featured=true et state=published dans la requête projets", async () => {
    const originalFind = client.find;
    const originalFindOne = client.findOne;
    let receivedQuery = null;

    client.findOne = async () => ({});
    client.find = async (resource, query) => {
      receivedQuery = query;
      const projects = [
        { id: 1, slug: "a", client: "X", label: "A", cover: null, featured: true, state: "published" },
        { id: 2, slug: "b", client: "X", label: "B", cover: null, featured: true, state: "draft" },
      ];
      const wantedState = query.filters?.state?.$eq;
      const wantedFeatured = query.filters?.featured?.$eq;
      const items = projects.filter(
        (project) =>
          (wantedState === undefined || project.state === wantedState) &&
          (wantedFeatured === undefined || project.featured === wantedFeatured)
      );
      return { items, pagination: null };
    };

    try {
      const result = await fetchHomeData();
      expect(result.projects.map((project) => project.slug)).toEqual(["a"]);
      expect(receivedQuery.filters).toEqual({ featured: { $eq: true }, state: { $eq: "published" } });
    } finally {
      client.find = originalFind;
      client.findOne = originalFindOne;
    }
  });
});

describe("fritzi-content-service — fetchProjectDetail masque les projets non publiés", () => {
  it("lève la même erreur 404 pour un projet trouvé mais non publié", async () => {
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

  it("lève la même erreur pour un slug absent (référence)", async () => {
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
});
