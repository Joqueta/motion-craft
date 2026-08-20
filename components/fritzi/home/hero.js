import { escapeHtml } from "../../../lib/text.js";

/**
 * Section Hero : nom en grand, rôle, bio courte, badges de statut.
 * @param {Object} props
 * @param {string} props.firstName
 * @param {string} props.lastName
 * @param {string} props.role
 * @param {string} props.bio
 * @param {{label: string, active: boolean}} props.status
 * @param {string} props.location
 * @param {{url: string, alt: string}} props.logo
 * @returns {HTMLElement}
 */
export function Hero(props) {
  validateHeroProps(props);

  const section = document.createElement("section");
  section.className = "hero";

  section.innerHTML = `
    

    <div class="hero__title-row">
      <div class="hero__name">
        <p class="hero__role">${escapeHtml(props.role)}</p>
        <h1 class="hero__title">
          <span>${escapeHtml(props.firstName)}</span>
          <span>${escapeHtml(props.lastName)}</span>
        </h1>
      </div>
      <img class="hero__mark" src="${escapeHtml(props.logo.url)}" alt="${escapeHtml(props.logo.alt)}" />

      <div class="hero__meta">
        <p class="hero__bio">${escapeHtml(props.bio)}</p>
        <div class="hero__badges">
          <span class="badge badge--status">
            <span class="badge__dot ${props.status.active ? "is-active" : ""}"></span>
            ${escapeHtml(props.status.label)}
          </span>
          <span class="badge badge--outline">${escapeHtml(props.location)}</span>
        </div>
      </div>
    </div>
  `;

  return section;
}

function validateHeroProps(props) {
  const required = ["firstName", "lastName", "role", "bio", "status", "location", "logo"];
  const missing = required.filter((key) => !props[key]);
  if (missing.length > 0) {
    throw new Error(`[Hero] Props manquantes: ${missing.join(", ")}`);
  }
}