import { describe, expect, it } from "./runner.js";
import client from "../services/cms-client.js";
import {
  loadFritziProjects,
  loadMediaLibrary,
  saveFritziProjects,
  loadFritziProjectDetail,
  createEmptyProjectDetailItem,
  createFritziProject,
  saveFritziProjectDetail,
  deleteFritziProject,
  missingProjectFields,
  loadFritziPage,
  saveFritziPage,
  missingPageFields,
} from "../services/fritzi-admin-service.js";

describe("fritzi-admin-service — loadFritziProjects", () => {
  it("mappe les projets avec cover, état et ordre, triés par order:asc", async () => {
    const originalFind = client.find;
    let receivedQuery = null;
    client.find = async (resource, query) => {
      receivedQuery = query;
      return {
        items: [
          {
            id: 7,
            slug: "aurora",
            client: ".decode",
            label: "Aurora",
            cover: { id: 3, url: "/uploads/a.png" },
            featured: true,
            order: 1,
            state: "published",
          },
          {
            id: 8,
            slug: "nova",
            client: ".decode",
            label: "Nova",
            cover: null,
            featured: false,
            order: 2,
            state: "draft",
          },
        ],
        pagination: null,
      };
    };

    try {
      const result = await loadFritziProjects();
      expect(receivedQuery.sort).toBe("order:asc");
      expect(result).toEqual([
        {
          id: 7,
          slug: "aurora",
          client: ".decode",
          label: "Aurora",
          cover: { id: 3, url: "http://localhost:1337/uploads/a.png" },
          featured: true,
          order: 1,
          state: "published",
        },
        {
          id: 8,
          slug: "nova",
          client: ".decode",
          label: "Nova",
          cover: null,
          featured: false,
          order: 2,
          state: "draft",
        },
      ]);
    } finally {
      client.find = originalFind;
    }
  });

  it("retombe sur l'état « draft » pour une valeur d'état absente ou inconnue", async () => {
    const originalFind = client.find;
    client.find = async () => ({
      items: [{ id: 9, slug: "x", client: "C", label: "L", cover: null, featured: false, order: 0, state: "" }],
      pagination: null,
    });

    try {
      const result = await loadFritziProjects();
      expect(result[0].state).toBe("draft");
    } finally {
      client.find = originalFind;
    }
  });
});

describe("fritzi-admin-service — loadMediaLibrary", () => {
  it("mappe la bibliothèque de médias en {id, name, url}", async () => {
    const originalFind = client.find;
    client.find = async (resource) => {
      if (resource !== "upload/files") throw new Error(`ressource inattendue : ${resource}`);
      return { items: [{ id: 4, name: "cover.png", url: "/uploads/cover.png" }], pagination: null };
    };

    try {
      const result = await loadMediaLibrary();
      expect(result).toEqual([{ id: 4, name: "cover.png", url: "http://localhost:1337/uploads/cover.png" }]);
    } finally {
      client.find = originalFind;
    }
  });
});

describe("fritzi-admin-service — saveFritziProjects", () => {
  it("met à jour les projets existants et supprime les projets retirés, sans jamais créer", async () => {
    const originalUpdate = client.update;
    const originalCreate = client.create;
    const originalRemove = client.remove;
    const calls = { update: [], create: [], remove: [] };

    client.update = async (resource, data) => {
      calls.update.push({ resource, data });
      return { id: 7 };
    };
    client.create = async (resource, data) => {
      calls.create.push({ resource, data });
      return { id: 99 };
    };
    client.remove = async (resource) => {
      calls.remove.push({ resource });
      return {};
    };

    const previous = [
      {
        id: 7,
        slug: "aurora",
        client: ".decode",
        label: "Aurora",
        cover: { id: 3, url: "x" },
        featured: true,
        order: 1,
        state: "published",
      },
      {
        id: 8,
        slug: "nova",
        client: ".decode",
        label: "Nova",
        cover: null,
        featured: false,
        order: 2,
        state: "draft",
      },
    ];
    const current = [
      {
        id: 7,
        slug: "aurora",
        client: ".decode",
        label: "Aurora v2",
        cover: { id: 3, url: "x" },
        featured: true,
        order: 1,
        state: "review",
      },
    ];

    try {
      await saveFritziProjects(current, previous);
      expect(calls.create.length).toBe(0);
      expect(calls.remove).toEqual([{ resource: "fritzi-projects/8" }]);
      expect(calls.update.length).toBe(1);
      expect(calls.update[0].resource).toBe("fritzi-projects/7");
      expect(calls.update[0].data).toEqual({
        slug: "aurora",
        client: ".decode",
        label: "Aurora v2",
        featured: true,
        order: 1,
        state: "review",
        cover: 3,
      });
    } finally {
      client.update = originalUpdate;
      client.create = originalCreate;
      client.remove = originalRemove;
    }
  });

  it("omet le champ cover si aucune image n'est sélectionnée", async () => {
    const originalUpdate = client.update;
    let receivedData = null;
    client.update = async (resource, data) => {
      receivedData = data;
      return { id: 8 };
    };

    const item = {
      id: 8,
      slug: "nova",
      client: ".decode",
      label: "Nova",
      cover: null,
      featured: false,
      order: 2,
      state: "draft",
    };

    try {
      await saveFritziProjects([item], [item]);
      expect("cover" in receivedData).toBe(false);
    } finally {
      client.update = originalUpdate;
    }
  });
});

describe("fritzi-admin-service — loadFritziProjectDetail", () => {
  it("mappe tous les champs d'un projet, paragraphes en texte multi-lignes", async () => {
    const originalFind = client.find;
    let receivedQuery = null;
    client.find = async (resource, query) => {
      receivedQuery = query;
      return {
        items: [
          {
            id: 7,
            slug: "decode-tv-display",
            client: ".decode",
            label: "TV display",
            cover: { id: 3, url: "/uploads/cover.png" },
            featured: true,
            order: 0,
            state: "published",
            title: "TV Display",
            eyebrow: "Collection of work",
            heroImage: { id: 9, url: "/uploads/hero.png" },
            meta: [
              { label: "Deliverable", value: "TV App" },
              { label: "Company", value: ".decode" },
            ],
            overview: {
              sideLabel: "Linkedin",
              eyebrow: "Overview",
              heading: "Digital tools often isolate us.",
              paragraphs: ["Premier paragraphe.", "Second paragraphe."],
            },
            discovery: {
              eyebrow: "Discovery phase",
              heading: "Understanding the problem",
              paragraphs: ["Paragraphe discovery."],
              image: { id: 10, url: "/uploads/discovery.png" },
            },
            challenge: {
              eyebrow: "The challenge",
              heading: "Balancing constraints",
              paragraphs: ["Paragraphe challenge."],
              backgroundImage: { id: 11, url: "/uploads/challenge.png" },
            },
            outcome: {
              eyebrow: "The outcome",
              heading: "Bridging the gap",
              paragraphs: ["Paragraphe outcome."],
              image: { id: 12, url: "/uploads/outcome.png" },
            },
          },
        ],
        pagination: null,
      };
    };

    try {
      const result = await loadFritziProjectDetail("decode-tv-display");
      expect(receivedQuery.filters.slug.$eq).toBe("decode-tv-display");
      expect(result.title).toBe("TV Display");
      expect(result.heroImage).toEqual({ id: 9, url: "http://localhost:1337/uploads/hero.png" });
      expect(result.meta).toEqual([
        { label: "Deliverable", value: "TV App" },
        { label: "Company", value: ".decode" },
      ]);
      expect(result.overview.paragraphs).toBe("Premier paragraphe.\nSecond paragraphe.");
      expect(result.discovery).toEqual({
        eyebrow: "Discovery phase",
        heading: "Understanding the problem",
        paragraphs: "Paragraphe discovery.",
        image: { id: 10, url: "http://localhost:1337/uploads/discovery.png" },
      });
      expect(result.challenge.backgroundImage).toEqual({
        id: 11,
        url: "http://localhost:1337/uploads/challenge.png",
      });
    } finally {
      client.find = originalFind;
    }
  });

  it("retourne null si aucun projet ne correspond au slug", async () => {
    const originalFind = client.find;
    client.find = async () => ({ items: [], pagination: null });
    try {
      const result = await loadFritziProjectDetail("inconnu");
      expect(result).toBe(null);
    } finally {
      client.find = originalFind;
    }
  });
});

describe("fritzi-admin-service — createEmptyProjectDetailItem", () => {
  it("retourne un projet vide avec des valeurs par défaut sûres", () => {
    const empty = createEmptyProjectDetailItem();
    expect(empty.id).toBe(null);
    expect(empty.state).toBe("draft");
    expect(empty.meta).toEqual([]);
    expect(empty.overview.paragraphs).toBe("");
    expect(empty.discovery.image).toBe(null);
  });
});

const detailFixture = {
  id: 7,
  slug: "decode-tv-display",
  client: ".decode",
  label: "TV display",
  cover: { id: 3, url: "x" },
  featured: true,
  order: 0,
  state: "published",
  title: "TV Display",
  eyebrow: "Collection of work",
  heroImage: { id: 9, url: "x" },
  meta: [{ label: "Deliverable", value: "TV App" }],
  overview: { sideLabel: "Linkedin", eyebrow: "Overview", heading: "Heading", paragraphs: "Un.\nDeux." },
  discovery: { eyebrow: "", heading: "", paragraphs: "", image: { id: 10, url: "x" } },
  challenge: { eyebrow: "", heading: "", paragraphs: "", backgroundImage: null },
  outcome: { eyebrow: "Outcome", heading: "", paragraphs: "", image: null },
};

describe("fritzi-admin-service — createFritziProject / saveFritziProjectDetail", () => {
  it("crée un projet : découpe les paragraphes, résout les médias en id, omet les composants entièrement vides", async () => {
    const originalCreate = client.create;
    let receivedData = null;
    client.create = async (resource, data) => {
      receivedData = data;
      return { ...detailFixture, id: 42 };
    };

    try {
      await createFritziProject(detailFixture);
      expect(receivedData.title).toBe("TV Display");
      expect(receivedData.cover).toBe(3);
      expect(receivedData.heroImage).toBe(9);
      expect(receivedData.meta).toEqual([{ label: "Deliverable", value: "TV App" }]);
      expect(receivedData.overview).toEqual({
        sideLabel: "Linkedin",
        eyebrow: "Overview",
        heading: "Heading",
        paragraphs: ["Un.", "Deux."],
      });
      expect(receivedData.discovery).toEqual({ eyebrow: "", heading: "", paragraphs: [], image: 10 });
      expect("challenge" in receivedData).toBe(false);
      expect(receivedData.outcome).toEqual({ eyebrow: "Outcome", heading: "", paragraphs: [] });
    } finally {
      client.create = originalCreate;
    }
  });

  it("édite un projet existant via update sur son id", async () => {
    const originalUpdate = client.update;
    let receivedResource = null;
    client.update = async (resource) => {
      receivedResource = resource;
      return detailFixture;
    };

    try {
      await saveFritziProjectDetail(7, detailFixture);
      expect(receivedResource).toBe("fritzi-projects/7");
    } finally {
      client.update = originalUpdate;
    }
  });
});

describe("fritzi-admin-service — deleteFritziProject", () => {
  it("appelle client.remove avec l'id du projet", async () => {
    const originalRemove = client.remove;
    let receivedResource = null;
    client.remove = async (resource) => {
      receivedResource = resource;
      return {};
    };

    try {
      await deleteFritziProject(7);
      expect(receivedResource).toBe("fritzi-projects/7");
    } finally {
      client.remove = originalRemove;
    }
  });
});

describe("fritzi-admin-service — missingProjectFields", () => {
  it("liste les champs requis manquants", () => {
    const incomplete = {
      client: "",
      label: "L",
      title: "",
      eyebrow: "E",
      cover: null,
      heroImage: { id: 1 },
    };
    expect(missingProjectFields(incomplete)).toEqual(["Client", "Titre", "Image de couverture"]);
  });

  it("retourne un tableau vide si tous les champs requis sont remplis", () => {
    const complete = {
      client: "C",
      label: "L",
      title: "T",
      eyebrow: "E",
      cover: { id: 1 },
      heroImage: { id: 2 },
    };
    expect(missingProjectFields(complete)).toEqual([]);
  });
});

describe("fritzi-admin-service — loadFritziPage / saveFritziPage", () => {
  it("charge et mappe la page 'profil'", async () => {
    const originalFindOne = client.findOne;
    let receivedResource = null;
    client.findOne = async (resource) => {
      receivedResource = resource;
      return {
        firstName: "Fritzi",
        lastName: "Frois",
        role: "Junior Fullstack Developer",
        bio: "Bio.",
        statusLabel: "Working at .decode",
        statusActive: true,
        location: "Paris",
        year: "2026",
        email: "fritzi@example.com",
        linkedin: "",
        instagram: "",
        contactHeading: ["Let's", "talk"],
      };
    };

    try {
      const result = await loadFritziPage("profil");
      expect(receivedResource).toBe("fritzi-profile");
      expect(result.firstName).toBe("Fritzi");
      expect(result.contactHeading).toBe("Let's\ntalk");
    } finally {
      client.findOne = originalFindOne;
    }
  });

  it("sauvegarde la page 'contact' avec seulement le portrait", async () => {
    const originalUpdate = client.update;
    let receivedResource = null;
    let receivedData = null;
    client.update = async (resource, data) => {
      receivedResource = resource;
      receivedData = data;
      return { heroPortrait: { id: 5, url: "/uploads/p.png" } };
    };

    try {
      await saveFritziPage("contact", { heroPortrait: { id: 5, url: "x" } });
      expect(receivedResource).toBe("fritzi-contact");
      expect(receivedData).toEqual({ heroPortrait: 5 });
    } finally {
      client.update = originalUpdate;
    }
  });

  it("mappe les offerings avec relatedWork imbriqué pour la page 'home'", async () => {
    const originalFindOne = client.findOne;
    client.findOne = async () => ({
      aboutHeading: "About",
      quoteLead: "L",
      quoteHighlight1: "H1",
      quoteConnector: "and",
      quoteHighlight2: "H2",
      quoteTail: "T",
      aboutCaption: "Caption",
      aboutPortrait: { id: 1, url: "/uploads/portrait.png" },
      skillsEyebrow: "Skills",
      skillsLine1: "P",
      skillsConnector: "and",
      skillsLine2: "S",
      skillsParagraphs: ["Un."],
      cvLabel: "CV",
      offeringsImage: { id: 2, url: "/uploads/leaf.png" },
      offerings: [
        {
          id: 1,
          number: "01",
          title: "Front-end",
          tag: "Related work",
          tools: "HTML, CSS",
          work: ["TV display"],
          relatedWork: [{ label: "Tv display", slug: "decode-tv-display" }],
        },
      ],
    });

    try {
      const result = await loadFritziPage("home");
      expect(result.offerings[0].title).toBe("Front-end");
      expect(result.offerings[0].work).toBe("TV display");
      expect(result.offerings[0].relatedWork).toEqual([{ label: "Tv display", slug: "decode-tv-display" }]);
    } finally {
      client.findOne = originalFindOne;
    }
  });
});

describe("fritzi-admin-service — missingPageFields", () => {
  it("détecte les champs requis manquants pour 'profil'", () => {
    const missing = missingPageFields("profil", { firstName: "", lastName: "Frois", role: "R", bio: "B", email: "" });
    expect(missing).toEqual(["Prénom", "Email"]);
  });
});
