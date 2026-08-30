import { escapeHtml } from "../../../lib/text.js";

export function Hero(props) {
  validateHeroProps(props);

  const section = document.createElement("section");
  section.className = "mathis-hero";

  section.innerHTML = `
    <div class="mathis-hero__column">
      <div>
        <h1 class="mathis-hero__title">${escapeHtml(props.firstName)} <span class="mathis-hero__lastname">${escapeHtml(props.lastName.toUpperCase())}</span></h1>
        <div class="mathis-hero__title-rule"></div>
      </div>
      <div class="mathis-hero__body">
        <div class="mathis-hero__text">
          <p class="mathis-hero__role">${escapeHtml(props.role)}</p>
          <p class="mathis-hero__bio">${escapeHtml(props.bio)}</p>
        </div>
        <a class="btn btn--outline" href="#projets">Découvrir mes projets</a>
      </div>
    </div>
    <div class="mathis-hero__photo">
      <img src="${escapeHtml(props.photo.url)}" alt="${escapeHtml(props.photo.alt)}" />
    </div>
  `;

  return section;
}

function validateHeroProps(props) {
  const required = ["firstName", "lastName", "role", "bio", "photo"];
  const missing = required.filter((key) => props?.[key] === undefined);
  if (missing.length > 0) {
    throw new Error(`[Hero] Props manquantes: ${missing.join(", ")}`);
  }
}
