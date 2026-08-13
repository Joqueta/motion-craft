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
        <p class="hero__role">${props.role}</p>
        <h1 class="hero__title">
          <span>${props.firstName}</span>
          <span>${props.lastName}</span>
        </h1>
      </div>
      <img class="hero__mark" src="${props.logo.url}" alt="${props.logo.alt}" />

      <div class="hero__meta">
        <p class="hero__bio">${props.bio}</p>
        <div class="hero__badges">
          <span class="badge badge--status">
            <span class="badge__dot ${props.status.active ? "is-active" : ""}"></span>
            ${props.status.label}
          </span>
          <span class="badge badge--outline">${props.location}</span>
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