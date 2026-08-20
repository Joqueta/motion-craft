import { isRouterActive } from "../../router/browser-router.js";
import { escapeHtml } from "../../../lib/text.js";

/**
 * Bloc "Next project" en bas de page détail.
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.title
 * @param {string} props.slug
 * @param {string} props.client
 * @param {string} props.tag
 * @param {{url: string, alt: string}} props.cover
 * @returns {HTMLElement}
 */
export function NextProject(props) {
  validateNextProjectProps(props);
  const fromRouter = isRouterActive();
  const href = escapeHtml(fromRouter ? `/fritzi/projets/${props.slug}` : `./projet.html?slug=${props.slug}`);

  const section = document.createElement("section");
  section.className = "next-project";

  section.innerHTML = `
    <span class="next-project__label">${escapeHtml(props.label)}</span>
    <h2 class="next-project__title">${escapeHtml(props.title)}</h2>
    <a class="work-card__frame" href="${href}"${fromRouter ? " data-route" : ""}>
      <img class="work-card__image" src="${escapeHtml(props.cover.url)}" alt="${escapeHtml(props.cover.alt)}" />
    </a>
    <div class="work-card__meta">
      <span class="work-card__client">${escapeHtml(props.client)}</span>
      <span class="work-card__label">${escapeHtml(props.label)}</span>
    </div>
  `;

  return section;
}

function validateNextProjectProps(props) {
  const required = ["label", "title", "slug", "client", "tag", "cover"];
  const missing = required.filter((key) => !props[key]);
  if (missing.length > 0) {
    throw new Error(`[NextProject] Props manquantes: ${missing.join(", ")}`);
  }
}