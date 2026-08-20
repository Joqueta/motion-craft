import { OfferingRowWithLinks } from "./offering-rows-with-links.js";
import { escapeHtml } from "../../../lib/text.js";

/**
 * Section "Person and skills" de la page About, avec liens related work.
 * @param {Object} props
 * @param {Object} props.content  (eyebrow, heading, paragraphs, cvLabel, offeringsImage)
 * @param {Array} props.offerings
 * @returns {HTMLElement}
 */
export function AboutSkillsSection(props) {
  if (!props?.content || !Array.isArray(props?.offerings)) {
    throw new Error("[AboutSkillsSection] props.content et props.offerings sont requis");
  }
  const { content, offerings } = props;

  const section = document.createElement("section");
  section.className = "skills";

  section.innerHTML = `
    <div class="skills__intro">
    <h2 class="skills__heading">${escapeHtml(content.line1)} ${escapeHtml(content.connector)} <em>${escapeHtml(content.line2)}</em></h2>
      ${content.paragraphs.map((p) => `<p class="skills__paragraph">${escapeHtml(p)}</p>`).join("")}
      <a class="btn btn--outline" href="#">${escapeHtml(content.cvLabel)}</a>
    </div>

    <img class="skills__image" src="${escapeHtml(content.offeringsImage.url)}" alt="${escapeHtml(content.offeringsImage.alt)}" />
  `;

  const list = document.createElement("div");
  list.className = "skills__list";
  offerings.forEach((offering) => list.appendChild(OfferingRowWithLinks(offering)));
  section.appendChild(list);

  return section;
}