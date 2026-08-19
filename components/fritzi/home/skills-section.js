import { OfferingRow } from "./offering-row.js";

/**
 * Section "Person and skills" — même structure de template que AboutMe :
 * eyebrow discret + titre en 2 lignes, une ligne simple, une ligne avec
 * un connecteur discret (is-muted) suivi d'un mot en emphase.
 *
 * @param {Object} props
 * @param {Object} props.content  (eyebrow, line1, connector, line2, paragraphs, cvLabel, offeringsImage)
 * @param {Array} props.offerings
 * @returns {HTMLElement}
 */
export function SkillsSection(props) {
  validateSkillsSectionProps(props);
  const { content, offerings } = props;

  const section = document.createElement("section");
  section.className = "skills";

  section.innerHTML = `
    <div class="skills__intro">
      <span class="skills__eyebrow">${content.eyebrow}</span>

      <div class="skills__heading-block">
        <p class="skills__highlight">${content.line1}</p>
        <p class="skills__highlight">
          <span class="is-muted">${content.connector}</span> ${content.line2}
        </p>
      </div>

      ${content.paragraphs.map((p) => `<p class="skills__paragraph">${p}</p>`).join("")}
      <a class="btn btn--outline" href="#">${content.cvLabel}</a>
    </div>

    <img class="skills__image" src="${content.offeringsImage.url}" alt="${content.offeringsImage.alt}" />
  `;

  const list = document.createElement("div");
  list.className = "skills__list";
  offerings.forEach((offering) => list.appendChild(OfferingRow(offering)));
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