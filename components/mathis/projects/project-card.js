import { escapeHtml } from "../../../lib/text.js";
import { isRouterActive } from "../../router/browser-router.js";

export function ProjectCard(props) {
  const fromRouter = isRouterActive();
  const href = escapeHtml(fromRouter ? `/mathis/projets/${props.slug}` : `/mathis/projets?slug=${props.slug}`);

  const article = document.createElement("article");
  article.className = "mathis-project-card";

  article.innerHTML = `
    <a class="mathis-project-card__link" href="${href}"${fromRouter ? " data-route" : ""}>
      <img class="mathis-project-card__thumb" src="${escapeHtml(props.cover.url)}" alt="${escapeHtml(props.cover.alt)}" />
      <h3 class="mathis-project-card__title">${escapeHtml(props.title)}</h3>
      <p class="mathis-project-card__excerpt">${escapeHtml(props.excerpt)}</p>
      <div class="mathis-project-card__tags">
        ${props.tags.map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </a>
  `;

  return article;
}
