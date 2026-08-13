/**
 * En-tête de la page Work.
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.eyebrow
 * @returns {HTMLElement}
 */
export function WorkHeader(props) {
    if (!props?.title || !props?.eyebrow) {
        throw new Error("[WorkHeader] props.title et props.eyebrow sont requis");
    }

    const section = document.createElement("section");
    section.className = "work-header";

    section.innerHTML = `
    <h1 class="work-header__title">${props.title}</h1>
    <span class="work-header__badge">${props.eyebrow}</span>
  `;

    return section;
}