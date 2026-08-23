import { describe, expect, it } from "./runner.js";
import { SkillsSection } from "../components/fritzi/shared/skills-section.js";

function buildProps(overrides = {}) {
  return {
    content: {
      eyebrow: "Ce que je fais",
      line1: "Design &",
      connector: "et",
      line2: "développement",
      paragraphs: ["Un paragraphe."],
      cvLabel: "Télécharger le CV",
      offeringsImage: { url: "/assets/offerings.jpg", alt: "Offerings" },
    },
    offerings: [
      { number: "01", title: "Front-end", tag: "Related work", tools: "HTML, CSS, JS", work: ["TV display"] },
    ],
    ...overrides,
  };
}

describe("SkillsSection", () => {
  it("rend l'eyebrow, les deux lignes de titre et l'image", () => {
    const section = SkillsSection(buildProps());
    expect(section.querySelector(".skills__eyebrow").textContent).toBe("Ce que je fais");
    const highlights = section.querySelectorAll(".skills__highlight");
    expect(highlights.length).toBe(2);
    expect(section.querySelector(".skills__image").getAttribute("src")).toBe("/assets/offerings.jpg");
  });

  it("rend une offering-row par offering", () => {
    const props = buildProps({
      offerings: [
        { number: "01", title: "Front-end", tag: "Related work", tools: "HTML, CSS, JS", work: ["TV display"] },
        { number: "02", title: "Motion", tag: "Related work", tools: "After Effects", work: ["Teaser"] },
      ],
    });
    const section = SkillsSection(props);
    expect(section.querySelectorAll(".offering-row").length).toBe(2);
  });

  it("lève une erreur si un champ de content manque", () => {
    const props = buildProps();
    delete props.content.cvLabel;
    expect(() => SkillsSection(props)).toThrow();
  });

  it("lève une erreur si offerings n'est pas un tableau", () => {
    const props = buildProps({ offerings: undefined });
    expect(() => SkillsSection(props)).toThrow();
  });
});
