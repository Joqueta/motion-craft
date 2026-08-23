import { describe, expect, it } from "./runner.js";
import { OfferingRow } from "../components/fritzi/shared/offering-row.js";

function buildProps(overrides = {}) {
  return {
    number: "01",
    title: "Front-end",
    tag: "Related work",
    tools: "HTML, CSS, JS",
    work: ["TV display"],
    relatedWork: [{ label: "TV display", slug: "decode-tv-display" }],
    projects: [
      { slug: "decode-tv-display", cover: { url: "/uploads/cover.png", alt: "Cover" } },
    ],
    ...overrides,
  };
}

describe("OfferingRow", () => {
  it("rend le numéro, le titre et les outils", () => {
    const row = OfferingRow(buildProps());
    expect(row.querySelector(".offering-row__number").textContent).toBe("01");
    expect(row.querySelector(".offering-row__title").textContent).toBe("Front-end");
    expect(row.querySelector(".offering-row__tools").textContent).toBe("HTML, CSS, JS");
  });

  it("transforme un work label relié à un projet en lien", () => {
    const row = OfferingRow(buildProps());
    const link = row.querySelector(".offering-row__work-label");
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toContain("decode-tv-display");
  });

  it("affiche un work label en texte simple si aucun projet lié", () => {
    const row = OfferingRow(buildProps({ relatedWork: [] }));
    const label = row.querySelector(".offering-row__work-label");
    expect(label.tagName).toBe("P");
  });

  it("bascule le tag vers la cover au survol d'un work label", () => {
    const row = OfferingRow(buildProps());
    const label = row.querySelector(".offering-row__work-label[data-cover-url]");
    const tag = row.querySelector(".offering-row__tag");
    const cover = row.querySelector(".offering-row__tag-cover");

    expect(label).toBeTruthy();
    label.dispatchEvent(new Event("mouseenter"));
    expect(tag.classList.contains("is-previewing")).toBeTruthy();
    expect(cover.getAttribute("src")).toBe("/uploads/cover.png");

    label.dispatchEvent(new Event("mouseleave"));
    expect(tag.classList.contains("is-previewing")).toBeFalsy();
  });

  it("lève une erreur si une prop requise manque", () => {
    const props = buildProps();
    delete props.tools;
    expect(() => OfferingRow(props)).toThrow();
  });

  it("lève une erreur si work est vide", () => {
    expect(() => OfferingRow(buildProps({ work: [] }))).toThrow();
  });
});
