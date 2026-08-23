import { escapeHtml } from "../../lib/text.js";
import { getNavLinks } from "./nav-links.js";

/**
 * Navigation principale.
 * @param {Object} props
 * @param {{url: string, alt: string}} props.logo
 * @param {string} [props.year]
 * @param {string[]} [props.links]
 * @returns {HTMLElement}
 */
export function Nav(props) {
  validateNavProps(props);
  const links = props.links || getNavLinks();
  const home = links.find((link) => link.label === "Home") || links[0];

  const header = document.createElement("header");
  header.className = "nav";

  header.innerHTML = `
    <a class="nav__logo" href="${escapeHtml(home.href)}"${home.dataRoute ? " data-route" : ""} aria-label="Retour à l'accueil">
      <img src="${escapeHtml(props.logo.url)}" alt="${escapeHtml(props.logo.alt)}" />
    </a>
    <nav class="nav__links" aria-label="Navigation principale">
      ${links.map((link) => `<a href="${escapeHtml(link.href)}"${link.dataRoute ? " data-route" : ""} class="nav__link">${escapeHtml(link.label)}</a>`).join("")}
    </nav>
    ${props.year ? `<span class="nav__year">${escapeHtml(props.year)}</span>` : ""}
  `;

  return header;
}

function validateNavProps(props) {
  if (!props?.logo?.url) {
    throw new Error("[Nav] props.logo.url est requis");
  }
}