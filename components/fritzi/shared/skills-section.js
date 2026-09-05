import { OfferingRow } from "./offering-row.js";
import { escapeHtml } from "../../../lib/text.js";

export function SkillsSection(props) {
  validateSkillsSectionProps(props);
  const { content, offerings, projects } = props;

  const section = document.createElement("section");
  section.className = "skills";

  section.innerHTML = `
    <div class="skills__intro">
      <span class="skills__eyebrow">${escapeHtml(content.eyebrow)}</span>

      <h2 class="skills__heading-block">
        <span class="skills__highlight">${escapeHtml(content.line1)}</span>
        <span class="skills__highlight">
          <span class="is-muted">${escapeHtml(content.connector)}</span> ${escapeHtml(content.line2)}
        </span>
      </h2>

      ${content.paragraphs.map((p) => `<p class="skills__paragraph">${escapeHtml(p)}</p>`).join("")}
      <a class="btn btn--outline" href="#">${escapeHtml(content.cvLabel)}</a>
    </div>

    <img class="skills__image" src="${escapeHtml(content.offeringsImage.url)}" alt="${escapeHtml(content.offeringsImage.alt)}" />
  `;

  const list = document.createElement("div");
  list.className = "skills__list";
  offerings.forEach((offering) => list.appendChild(OfferingRow({ ...offering, projects })));
  section.appendChild(list);

  return section;
}

function validateSkillsSectionProps(props) {
  const required = ["eyebrow", "line1", "connector", "line2", "paragraphs", "cvLabel", "offeringsImage"];
  const missing = required.filter((key) => props?.content?.[key] === undefined);
  if (missing.length > 0 || !Array.isArray(props?.offerings)) {
    throw new Error(
      `[SkillsSection] Props manquantes dans content: ${missing.join(", ")}${!Array.isArray(props?.offerings) ? " (+ offerings doit être un tableau)" : ""
      }`
    );
  }
}
