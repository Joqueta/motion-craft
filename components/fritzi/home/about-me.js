import { EyeFocus } from "../eye-focus.js";

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
    <img class="about-me__portrait" src="${props.portrait.url}" alt="${props.portrait.alt}" />

    <div class="about-me__quote">
      <p class="about-me__lead">${props.quote.lead}</p>
      <p class="about-me__highlight">
        ${props.quote.highlight1} <span class="is-muted">${props.quote.connector}</span>
      </p>
      <p class="about-me__highlight">
        ${props.quote.highlight2} <span class="is-muted">${props.quote.tail}</span>
      </p>
      <p class="about-me__caption">${props.caption}</p>
    </div>
  `;
  return section;
}

function validateAboutMeProps(props) {
  const required = ["heading", "quote", "caption", "portrait"];
  const missing = required.filter((key) => !props[key]);
  if (missing.length > 0) {
    throw new Error(`[AboutMe] Props manquantes: ${missing.join(", ")}`);
  }
}