import { isRouterActive } from "../router/browser-router.js";

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
  const fromRouter = isRouterActive();
  const links = props.links || (fromRouter
    ? [
        { label: "Home", href: "/fritzi" },
        { label: "Work", href: "/fritzi/work" },
        { label: "About / Services", href: "/fritzi/about" }
      ]
    : [
        { label: "Home", href: "./#" },
        { label: "Work", href: "/fritzi/work.html" },
        { label: "About / Services", href: "/fritzi/about.html" }
      ]);

  const header = document.createElement("header");
  header.className = "nav";

  header.innerHTML = `
    <a class="nav__logo" href="${fromRouter ? "/fritzi" : "./#"}"${fromRouter ? " data-route" : ""} aria-label="Retour à l'accueil">
      <img src="${props.logo.url}" alt="${props.logo.alt}" />
    </a>
    <nav class="nav__links" aria-label="Navigation principale">
      ${links.map((link) => `<a href="${link.href}"${fromRouter ? " data-route" : ""} class="nav__link">${link.label}</a>`).join("")}
    </nav>
    ${props.year ? `<span class="nav__year">${props.year}</span>` : ""}
  `;

  return header;
}

function validateNavProps(props) {
  if (!props?.logo?.url) {
    throw new Error("[Nav] props.logo.url est requis");
  }
}