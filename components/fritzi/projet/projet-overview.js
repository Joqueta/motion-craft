import { escapeHtml } from "../../../lib/text.js";

export function ProjectOverview(props) {
  validateOverviewProps(props);

  const section = document.createElement("section");
  section.className = "project-overview";

  section.innerHTML = `
    <span class="project-overview__side-label"></span>
    <div class="project-overview__content">
      <span class="project-overview__eyebrow">${escapeHtml(props.eyebrow)}</span>
      <h2 class="project-overview__heading">${escapeHtml(props.heading)}</h2>
      ${props.paragraphs.map((p) => `<p class="project-overview__paragraph">${escapeHtml(p)}</p>`).join("")}
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