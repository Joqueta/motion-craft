import { EyeReveal } from "../eye-reveal.js";
import { escapeHtml } from "../../../lib/text.js";

export function AboutHero(props) {
  validateAboutHeroProps(props);

  const section = document.createElement("section");
  section.className = "about-hero";

  section.innerHTML = `
    <img class="about-hero__portrait" src="${escapeHtml(props.portrait.url)}" alt="${escapeHtml(props.portrait.alt)}" />

    <div class="about-hero__row">

    </div>
    <div class="about-hero__role">
      <h1 class="about-hero__role">${escapeHtml(props.role).replace(/\s+/g, "<br />")}</h1>
      <div class="about-hero__location">
        <span class="about-hero__location-label">${escapeHtml(props.locationLabel)}</span>
        <span class="about-hero__location-value">${escapeHtml(props.location)}</span>
      </div>
    </div>

    <div class="about-hero__bio">
      ${props.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
    </div>
  `;

  section.appendChild(EyeReveal({ xPercent: 42, yPercent: 30 }));

  return section;
}

function validateAboutHeroProps(props) {
  const required = ["role", "locationLabel", "location", "portrait", "paragraphs"];
  const missing = required.filter((key) => !props[key]);
  if (missing.length > 0) {
    throw new Error(`[AboutHero] Props manquantes: ${missing.join(", ")}`);
  }
}