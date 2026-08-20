import { escapeHtml } from "../../../lib/text.js";

/**
 * Section "The challenge" : photo de fond assombrie + texte centré en surimpression.
 * @param {Object} props
 * @param {string} props.eyebrow
 * @param {string} props.heading
 * @param {string[]} props.paragraphs
 * @param {{url: string, alt: string}} props.backgroundImage
 * @returns {HTMLElement}
 */
export function ProjectChallenge(props) {
    validateChallengeProps(props);

    const section = document.createElement("section");
    section.className = "project-challenge";

    section.innerHTML = `
    <img class="project-challenge__bg" src="${escapeHtml(props.backgroundImage.url)}" alt="${escapeHtml(props.backgroundImage.alt)}" />
    <div class="project-challenge__overlay">
      <span class="project-challenge__eyebrow">${escapeHtml(props.eyebrow)}</span>
      <h2 class="project-challenge__heading">${escapeHtml(props.heading)}</h2>
      ${props.paragraphs.map((p) => `<p class="project-challenge__paragraph">${escapeHtml(p)}</p>`).join("")}
    </div>
  `;

    return section;
}

function validateChallengeProps(props) {
    const required = ["eyebrow", "heading", "paragraphs", "backgroundImage"];
    const missing = required.filter((key) => !props[key]);
    if (missing.length > 0) {
        throw new Error(`[ProjectChallenge] Props manquantes: ${missing.join(", ")}`);
    }
}