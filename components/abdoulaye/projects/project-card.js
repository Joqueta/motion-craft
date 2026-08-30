import { escapeHtml } from "../../../lib/text.js";
import { isRouterActive } from "../../router/browser-router.js";

export function ProjectCard(props) {
  const fromRouter = isRouterActive();
  const href = escapeHtml(fromRouter ? `/abdoulaye/projets/${props.slug}` : `/abdoulaye/projets?slug=${props.slug}`);

  const article = document.createElement("article");
  article.className = "project-card";

  article.innerHTML = `
    <a class="project-card__link" href="${href}"${fromRouter ? " data-route" : ""}>
      <img class="project-card__image" src="${escapeHtml(props.cover.url)}" alt="${escapeHtml(props.cover.alt)}" />
      <div class="project-card__body">
        <h3 class="project-card__title">${escapeHtml(props.title)}</h3>
        <div class="project-card__tags">
          ${props.tags.map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <p class="project-card__excerpt">${escapeHtml(props.excerpt)}</p>
      </div>
    </a>
  `;

  return article;
}
