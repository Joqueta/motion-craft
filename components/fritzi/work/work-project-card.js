/**
 * Carte de projet utilisée dans le carrousel Work.
 * @param {Object} props
 * @param {string} props.slug
 * @param {string} props.client
 * @param {string} props.label
 * @param {{url: string, alt: string}} props.cover
 * @returns {HTMLElement}
 */
export function WorkProjectCard(props) {
    validateCardProps(props);

    const article = document.createElement("article");
    article.className = "work-card";

    article.innerHTML = `
    <a class="work-card__frame" href="./projet?slug=${props.slug}">
      <img class="work-card__image" src="${props.cover.url}" alt="${props.cover.alt}" />
    </a>
    <div class="work-card__meta">
      <span class="work-card__client">${props.client}</span>
      <span class="work-card__label">${props.label}</span>
    </div>
  `;

    return article;
}

function validateCardProps(props) {
    const required = ["slug", "client", "label", "cover"];
    const missing = required.filter((key) => !props[key]);
    if (missing.length > 0) {
        throw new Error(`[WorkProjectCard] Props manquantes: ${missing.join(", ")}`);
    }
}