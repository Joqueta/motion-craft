/**
 * Bandeau sous le nav principal : label de collection + bouton "close project".
 * @param {Object} props
 * @param {string} props.eyebrow
 * @param {string} [props.closeLabel]
 * @param {string} [props.closeHref]
 * @returns {HTMLElement}
 */
export function ProjectSubbar(props) {
    if (!props?.eyebrow) {
        throw new Error("[ProjectSubbar] props.eyebrow est requis");
    }

    const bar = document.createElement("div");
    bar.className = "project-subbar";

    bar.innerHTML = `
    <span class="project-subbar__eyebrow">${props.eyebrow}</span>
    <a class="btn btn--outline btn--small" href="${props.closeHref || "../index.html"}">
      ${props.closeLabel || "Close this project"}
    </a>
  `;

    return bar;
}