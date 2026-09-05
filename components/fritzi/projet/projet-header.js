import { escapeHtml } from "../../../lib/text.js";

export function ProjectHeader(props) {
    validateProjectHeaderProps(props);

    const section = document.createElement("section");
    section.className = "project-header";

    section.innerHTML = `
    <h1 class="project-header__title">${escapeHtml(props.title)}</h1>
    <dl class="project-header__meta">
      ${props.meta
            .map(
                (item) => `
        <div class="project-header__meta-item">
          <dt>${escapeHtml(item.label)}</dt>
          <dd>${escapeHtml(item.value).replace(/\n/g, "<br />")}</dd>
        </div>`
            )
            .join("")}
    </dl>
  `;

    return section;
}

function validateProjectHeaderProps(props) {
    if (!props?.title || !Array.isArray(props?.meta)) {
        throw new Error("[ProjectHeader] props.title et props.meta (tableau) sont requis");
    }
}