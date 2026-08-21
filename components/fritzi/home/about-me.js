import { EyeReveal } from "../eye-reveal.js";
import { escapeHtml } from "../../../lib/text.js";

/**
 * Section "About Me" — portrait plein cadre + titre géant en surimpression + citation.
 * @param {Object} props
 * @param {string} props.heading
 * @param {Object} props.quote
 * @param {string} props.caption
 * @param {{url: string, alt: string}} props.portrait
 * @returns {HTMLElement}
 */
export function AboutMe(props) {
  validateAboutMeProps(props);

  const section = document.createElement("section");
  section.className = "about-me";

  section.innerHTML = `
    <img class="about-me__portrait" src="${escapeHtml(props.portrait.url)}" alt="${escapeHtml(props.portrait.alt)}" />

    <div class="about-me__quote">
      <p class="about-me__lead">${escapeHtml(props.quote.lead)}</p>
      <p class="about-me__highlight">
        ${escapeHtml(props.quote.highlight1)} <span class="is-muted">${escapeHtml(props.quote.connector)}</span>
      </p>
      <p class="about-me__highlight">
        ${escapeHtml(props.quote.highlight2)} <span class="is-muted">${escapeHtml(props.quote.tail)}</span>
      </p>
      <p class="about-me__caption">${escapeHtml(props.caption)}</p>
    </div>
  `;

  section.appendChild(EyeReveal({ xPercent: 42, yPercent: 30 }));

  return section;
}

function validateAboutMeProps(props) {
  const required = ["heading", "quote", "caption", "portrait"];
  const missing = required.filter((key) => !props[key]);
  if (missing.length > 0) {
    throw new Error(`[AboutMe] Props manquantes: ${missing.join(", ")}`);
  }
}