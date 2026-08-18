import { describe, expect, it } from "./runner.js";
import { toOffering, toProjectCard, toTextImageBlock } from "../services/fritzi-content-service.js";

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
