import { escapeHtml } from "../../../lib/text.js";

export function DetailContent(props) {
  const section = document.createElement("section");
  section.className = "mathis-detail-content";

  section.innerHTML = `
    <div class="mathis-detail-content__preview">
      <img src="${escapeHtml(props.heroImage.url)}" alt="${escapeHtml(props.heroImage.alt)}" />
    </div>

    <div class="mathis-detail-content__column">
      <h2 class="mathis-detail-content__heading">Description</h2>
      <p class="mathis-detail-content__text">${escapeHtml(props.description)}</p>

      <h2 class="mathis-detail-content__heading">Contexte</h2>
      <p class="mathis-detail-content__text">${escapeHtml(props.context)}</p>

      ${
        props.collaborator
          ? `
        <h2 class="mathis-detail-content__heading">Collaborateur</h2>
        <p class="mathis-detail-content__text">${escapeHtml(props.collaborator)}</p>
      `
          : ""
      }

      ${
        props.linkUrl
          ? `
        <h2 class="mathis-detail-content__heading">${escapeHtml(props.linkLabel || "Lien du projet")}</h2>
        <a class="mathis-detail-content__link" href="${escapeHtml(props.linkUrl)}" target="_blank" rel="noopener">${escapeHtml(props.linkUrl)}</a>
      `
          : ""
      }
    </div>
  `;

  return section;
}
