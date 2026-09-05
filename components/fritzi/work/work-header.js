import { escapeHtml } from "../../../lib/text.js";

export function WorkHeader(props) {
    if (!props?.title || !props?.eyebrow) {
        throw new Error("[WorkHeader] props.title et props.eyebrow sont requis");
    }

    const section = document.createElement("section");
    section.className = "work-header";

    section.innerHTML = `
    <h1 class="work-header__title">${escapeHtml(props.title)}</h1>
    <span class="work-header__badge-wrap">
      <span class="work-header__badge">${escapeHtml(props.eyebrow)}</span>
    </span>
  `;

    return section;
}