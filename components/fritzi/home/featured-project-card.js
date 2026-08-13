/**
 * Carte de projet mis en avant.
 * @param {Object} props
 * @param {string} props.slug
 * @param {string} props.client
 * @param {string} props.label
 * @param {{url: string, alt: string}} props.cover
 * @returns {HTMLElement}
 */
export function FeaturedProjectCard(props) {
  validateProjectCardProps(props);

  const article = document.createElement("article");
  article.className = "project-card";

  article.innerHTML = `
    <a href="/projets/${props.slug}" data-route class="project-card__frame">
      <img class="project-card__image" src="${props.cover.url}" alt="${props.cover.alt}" />
    </a>
    <div class="project-card__meta">
      <span class="project-card__client">${props.client}</span>
      <span class="project-card__label">${props.label}</span>
    </div>
  `;

  return article;
}

function validateProjectCardProps(props) {
  const required = ["slug", "client", "label", "cover"];
  const missing = required.filter((key) => !props[key]);
  if (missing.length > 0) {
    throw new Error(`[FeaturedProjectCard] Props manquantes: ${missing.join(", ")}`);
  }
}