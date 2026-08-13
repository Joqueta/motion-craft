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
    const links = props.links || ["Home", "Work", "About / Services"];

    const header = document.createElement("header");
    header.className = "nav";

    header.innerHTML = `
    <a class="nav__logo" href="./index.html" aria-label="Retour à l'accueil">
      <img src="${props.logo.url}" alt="${props.logo.alt}" />
    </a>
    <nav class="nav__links" aria-label="Navigation principale">
      ${links.map((link) => `<a href="#" class="nav__link">${link}</a>`).join("")}
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