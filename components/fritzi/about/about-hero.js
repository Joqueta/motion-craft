import { EyeFocus } from "../eye-focus.js";

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
    <img class="about-hero__portrait" src="${props.portrait.url}" alt="${props.portrait.alt}" />

    <h1 class="about-hero__heading" aria-hidden="true">
      <span>About</span><span>Me</span>
    </h1>

    <p class="about-hero__role">${props.role.replace(/\s+/g, "<br />")}</p>

    <div class="about-hero__location">
      <span class="about-hero__location-label">${props.locationLabel}</span>
      <span class="about-hero__location-value">${props.location}</span>
    </div>

    <div class="about-hero__bio">
      ${props.paragraphs.map((p) => `<p>${p}</p>`).join("")}
    </div>
  `;

  return section;
}

function validateAboutHeroProps(props) {
  const required = ["role", "locationLabel", "location", "portrait", "paragraphs"];
  const missing = required.filter((key) => !props[key]);
  if (missing.length > 0) {
    throw new Error(`[AboutHero] Props manquantes: ${missing.join(", ")}`);
  }
}