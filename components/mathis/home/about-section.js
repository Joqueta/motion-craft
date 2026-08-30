import { escapeHtml } from "../../../lib/text.js";

function skillCard(heading, items) {
  return `
    <div class="mathis-skills__card">
      <h3 class="mathis-skills__heading">${escapeHtml(heading)}</h3>
      <ul class="mathis-skills__list">
        ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `;
}

export function AboutSection(props) {
  const section = document.createElement("section");
  section.className = "mathis-about";

  section.innerHTML = `
    <h2 class="mathis-about__title">À <span class="mathis-about__accent">propos</span></h2>
    <p class="mathis-about__bio">${escapeHtml(props.bio)}</p>
    <div class="mathis-skills">
      ${skillCard("Langages", props.skillsLanguages)}
      ${skillCard("Frameworks", props.skillsFrameworks)}
      ${skillCard("Outils", props.skillsTools)}
    </div>
  `;

  return section;
}
