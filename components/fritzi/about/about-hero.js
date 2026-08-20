import { EyeFocus } from "../eye-focus.js";
import { escapeHtml } from "../../../lib/text.js";

/**
 * Hero "About Me" : portrait en fond, titre géant en surimpression,
 * bloc rôle en bas à gauche, bloc localisation à droite, bio centrée en bas.
 * @param {Object} props
 * @param {string} props.role
 * @param {string} props.locationLabel
 * @param {string} props.location
 * @param {{url: string, alt: string}} props.portrait
 * @param {string[]} props.paragraphs
 * @returns {HTMLElement}
 */
export function AboutHero(props) {
  validateAboutHeroProps(props);

  const section = document.createElement("section");
  section.className = "about-hero";

  section.innerHTML = `
    <div class="about-hero__row">
     
    </div>
    <div class="about-hero__role">
      <p class="about-hero__role">${escapeHtml(props.role).replace(/\s+/g, "<br />")}</p>
      <div class="about-hero__location">
        <span class="about-hero__location-label">${escapeHtml(props.locationLabel)}</span>
        <span class="about-hero__location-value">${escapeHtml(props.location)}</span>
      </div>
    </div>

    <div class="about-hero__bio">
      ${props.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
    </div>
  `;

  return section;
}

function validateAboutHeroProps(props) {
  const required = ["role", "locationLabel", "location", "paragraphs"];
  const missing = required.filter((key) => !props[key]);
  if (missing.length > 0) {
    throw new Error(`[AboutHero] Props manquantes: ${missing.join(", ")}`);
  }
}