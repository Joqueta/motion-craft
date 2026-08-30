import { escapeHtml } from "../../lib/text.js";
import { getNavLinks } from "./nav-links.js";
import { SkipLink } from "./skip-link.js";

export function Nav(props = {}) {
  const links = props.links || getNavLinks();
  const home = links[0];

  const header = document.createElement("header");
  header.className = "abdoulaye-nav";

  header.innerHTML = `
    <a class="abdoulaye-nav__logo" href="${escapeHtml(home.href)}"${home.dataRoute ? " data-route" : ""} aria-label="Retour à l'accueil">Ab</a>
    <nav class="abdoulaye-nav__links" aria-label="Navigation principale">
      ${links.map((link) => `<a href="${escapeHtml(link.href)}"${link.dataRoute ? " data-route" : ""} class="abdoulaye-nav__link${link.active ? " is-active" : ""}">${escapeHtml(link.label)}</a>`).join("")}
    </nav>
    <a class="abdoulaye-nav__cta btn btn--primary" href="${escapeHtml(links[3].href)}"${links[3].dataRoute ? " data-route" : ""}>Me contacter</a>
  `;

  const fragment = document.createDocumentFragment();
  fragment.appendChild(SkipLink());
  fragment.appendChild(header);
  return fragment;
}
