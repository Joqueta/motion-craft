/**
 * En-tête de la page détail projet : titre géant + ligne de métadonnées.
 * @param {Object} props
 * @param {string} props.title
 * @param {Array<{label: string, value: string}>} props.meta
 * @returns {HTMLElement}
 */
export function ProjectHeader(props) {
    validateProjectHeaderProps(props);

    const section = document.createElement("section");
    section.className = "project-header";

    section.innerHTML = `
    <h1 class="project-header__title">${props.title}</h1>
    <dl class="project-header__meta">
      ${props.meta
            .map(
                (item) => `
        <div class="project-header__meta-item">
          <dt>${item.label}</dt>
          <dd>${item.value.replace(/\n/g, "<br />")}</dd>
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