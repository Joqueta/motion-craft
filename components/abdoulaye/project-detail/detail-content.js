import { escapeHtml } from "../../../lib/text.js";

export function DetailContent(props) {
  const section = document.createElement("section");
  section.className = "detail-content";

  section.innerHTML = `
    <img class="detail-content__image" src="${escapeHtml(props.cover.url)}" alt="${escapeHtml(props.cover.alt)}" />

    <div class="detail-content__column">
      <h2 class="detail-content__heading">Description</h2>
      <p class="detail-content__description">${escapeHtml(props.description)}</p>

      <h2 class="detail-content__heading">Stack technique</h2>
      <ul class="detail-content__stack">
        ${props.stack.map((item) => `<li>→ ${escapeHtml(item)}</li>`).join("")}
      </ul>

      <h2 class="detail-content__heading">Période</h2>
      <p class="detail-content__period">
        ${escapeHtml(props.periodLabel)}
        ${props.periodPlace ? `<br /><span class="detail-content__place">${escapeHtml(props.periodPlace)}</span>` : ""}
      </p>

      <div class="detail-content__cta">
        ${props.repoUrl ? `<a class="btn btn--primary" href="${escapeHtml(props.repoUrl)}" target="_blank" rel="noopener">Voir le code</a>` : ""}
        ${props.demoUrl ? `<a class="btn btn--outline" href="${escapeHtml(props.demoUrl)}" target="_blank" rel="noopener">Voir la démo</a>` : ""}
      </div>
    </div>
  `;

  return section;
}
