import { escapeHtml } from "../../../lib/text.js";
import { isRouterActive } from "../../router/browser-router.js";

export function ProjectCard(props) {
  const fromRouter = isRouterActive();
  const href = escapeHtml(fromRouter ? `/abdoulaye/projets/${props.slug}` : `/abdoulaye/projets?slug=${props.slug}`);
  const meta = [props.periodLabel, props.periodPlace].filter(Boolean).join(" · ");

  const article = document.createElement("article");
  article.className = "project-card";

  article.innerHTML = `
    <a class="project-card__link" href="${href}"${fromRouter ? " data-route" : ""}>
      <div class="project-card__head">
        <img class="project-card__thumb" src="${escapeHtml(props.cover.url)}" alt="${escapeHtml(props.cover.alt)}" />
        ${props.statusBadge ? `<span class="project-card__eyebrow">${escapeHtml(props.statusBadge)}</span>` : ""}
      </div>
      <h3 class="project-card__title">${escapeHtml(props.title)}</h3>
      ${meta ? `<p class="project-card__meta">${escapeHtml(meta)}</p>` : ""}
      <p class="project-card__excerpt">${escapeHtml(props.excerpt)}</p>
      <div class="project-card__tags">
        ${props.tags.map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </a>
  `;

  return article;
}
