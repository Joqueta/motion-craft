import { isRouterActive } from "../../router/browser-router.js";
import { escapeHtml } from "../../../lib/text.js";

/**
 * Ligne "offering" avec liste de projets liés (utilisée sur About, contrairement
 * à la version simple de la Home).
 * @param {Object} props
 * @param {string} props.number
 * @param {string} props.title
 * @param {string} props.tools
 * @param {Array<{label: string, slug: string}>} props.relatedWork
 * @returns {HTMLElement}
 */
export function OfferingRowWithLinks(props) {
    validateProps(props);
    const fromRouter = isRouterActive();

    const row = document.createElement("div");
    row.className = "offering-row";

    row.innerHTML = `
    <span class="offering-row__number">${escapeHtml(props.number)}</span>
    <div class="offering-row__body">
      <div class="offering-row__top">
        <h3 class="offering-row__title">${escapeHtml(props.title)}</h3>
        <span class="offering-row__related-label">Related work ↓</span>
      </div>
      <div class="offering-row__bottom">
        <p class="offering-row__tools">${escapeHtml(props.tools)}</p>
        <ul class="offering-row__links">
          ${props.relatedWork
            .map((item) => {
                const href = escapeHtml(fromRouter ? `/fritzi/projets/${item.slug}` : `./projet.html?slug=${item.slug}`);
                return `<li><a href="${href}"${fromRouter ? " data-route" : ""}>${escapeHtml(item.label)}</a></li>`;
            })
            .join("")}
        </ul>
      </div>
    </div>
  `;

    return row;
}

function validateProps(props) {
    const required = ["number", "title", "tools", "relatedWork"];
    const missing = required.filter((key) => !props[key]);
    if (missing.length > 0) {
        throw new Error(`[OfferingRowWithLinks] Props manquantes: ${missing.join(", ")}`);
    }
}