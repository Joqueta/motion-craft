/**
 * Section "Overview" : label latéral + gros texte d'intro + paragraphes.
 * @param {Object} props
 * @param {string} props.sideLabel
 * @param {string} props.eyebrow
 * @param {string} props.heading
 * @param {string[]} props.paragraphs
 * @returns {HTMLElement}
 */
export function ProjectOverview(props) {
    validateOverviewProps(props);

    const section = document.createElement("section");
    section.className = "project-overview";

    section.innerHTML = `
    <span class="project-overview__side-label">${props.sideLabel}</span>
    <div class="project-overview__content">
      <span class="project-overview__eyebrow">${props.eyebrow}</span>
      <h2 class="project-overview__heading">${props.heading}</h2>
      ${props.paragraphs.map((p) => `<p class="project-overview__paragraph">${p}</p>`).join("")}
    </div>
  `;

    return section;
}

function validateOverviewProps(props) {
    const required = ["sideLabel", "eyebrow", "heading", "paragraphs"];
    const missing = required.filter((key) => !props[key]);
    if (missing.length > 0) {
        throw new Error(`[ProjectOverview] Props manquantes: ${missing.join(", ")}`);
    }
}