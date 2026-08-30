import { escapeHtml } from "../../../lib/text.js";

export function AboutSection(props) {
  const section = document.createElement("section");
  section.className = "about";

  section.innerHTML = `
    <span class="page-eyebrow">${escapeHtml(props.eyebrow ?? "")}</span>
    <h2 class="about__heading">${escapeHtml(props.heading ?? "")}</h2>
    <p class="about__intro">${escapeHtml(props.intro)}</p>

    <div class="about__info-grid">
      ${props.infoItems
        .map(
          (item) => `
            <div class="about__info-item">
              <span class="about__info-label">${escapeHtml(item.label)}</span>
              <span class="about__info-value">${escapeHtml(item.value)}</span>
            </div>
          `,
        )
        .join("")}
    </div>

    <div class="about__skills">
      <h2 class="about__block-heading">Langages maîtrisés</h2>
      ${props.skills
        .map(
          (skill) => `
            <div class="about__skill">
              <div class="about__skill-row">
                <span>${escapeHtml(skill.label)}</span>
                <span>${escapeHtml(String(skill.percent))}%</span>
              </div>
              <div class="about__skill-track">
                <div class="about__skill-fill" style="width: ${Number(skill.percent) || 0}%"></div>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>

    <div class="about__chips-block">
      <h2 class="about__block-heading">Technologies &amp; Outils</h2>
      <div class="about__chips">
        ${props.techTags.map((tag) => `<span class="about__chip">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </div>

    <div class="about__chips-block">
      <h2 class="about__block-heading">Langues</h2>
      <div class="about__chips">
        ${props.languages.map((tag) => `<span class="about__chip">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </div>

    <div class="about__chips-block">
      <h2 class="about__block-heading">Centres d'intérêt</h2>
      <div class="about__chips">
        ${props.interests.map((tag) => `<span class="about__chip">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </div>
  `;

  return section;
}
