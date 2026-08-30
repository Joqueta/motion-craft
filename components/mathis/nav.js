import { escapeHtml } from "../../lib/text.js";
import { getNavLinks } from "./nav-links.js";
import { SkipLink } from "./skip-link.js";

export function Nav(props = {}) {
  const links = props.links || getNavLinks();
  const home = links[0];

  const header = document.createElement("header");
  header.className = "mathis-nav";

  header.innerHTML = `
    <a class="mathis-nav__logo" href="${escapeHtml(home.href)}"${home.dataRoute ? " data-route" : ""} aria-label="Retour à l'accueil">MV</a>
    <nav class="mathis-nav__links" aria-label="Navigation principale">
      ${links
        .map(
          (link) =>
            `<a href="${escapeHtml(link.href)}"${link.dataRoute ? " data-route" : ""} class="mathis-nav__link${link.active ? " is-active" : ""}"${link.active ? ' aria-current="page"' : ""}>${escapeHtml(link.label)}</a>`,
        )
        .join("")}
    </nav>
  `;

  const fragment = document.createDocumentFragment();
  fragment.appendChild(SkipLink());
  fragment.appendChild(header);
  return fragment;
}
