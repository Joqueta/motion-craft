/**
 * Bloc "Next project" en bas de page détail.
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.title
 * @param {string} props.slug
 * @param {string} props.client
 * @param {string} props.tag
 * @param {{url: string, alt: string}} props.cover
 * @returns {HTMLElement}
 */
export function NextProject(props) {
    validateNextProjectProps(props);

    const section = document.createElement("section");
    section.className = "next-project";

    section.innerHTML = `
    <span class="next-project__label">${props.label}</span>
    <h2 class="next-project__title">${props.title}</h2>
    <a class="next-project__card" href="/projets/${props.slug}" data-route>
      <img src="${props.cover.url}" alt="${props.cover.alt}" />
      <span class="next-project__meta">
        <span>${props.client}</span>
        <span>${props.tag}</span>
      </span>
    </a>
  `;

    return section;
}

function validateNextProjectProps(props) {
    const required = ["label", "title", "slug", "client", "tag", "cover"];
    const missing = required.filter((key) => !props[key]);
    if (missing.length > 0) {
        throw new Error(`[NextProject] Props manquantes: ${missing.join(", ")}`);
    }
}