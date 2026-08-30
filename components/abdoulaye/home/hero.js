import { escapeHtml } from "../../../lib/text.js";
import { TerminalCard } from "./terminal-card.js";

export function Hero(props) {
  validateHeroProps(props);

  const section = document.createElement("section");
  section.className = "hero";

  section.innerHTML = `
    <div class="hero__column">
      <p class="hero__status">${escapeHtml(props.status.label)}</p>
      <h1 class="hero__title">${escapeHtml(props.firstName)} ${escapeHtml(props.lastName)}</h1>
      <p class="hero__role">${escapeHtml(props.role)}</p>
      <p class="hero__bio">${escapeHtml(props.bio)}</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="/abdoulaye/projets" data-route>Voir mes projets</a>
        <a class="btn btn--outline" href="/abdoulaye/contact" data-route>Me contacter</a>
      </div>
      <div class="hero__stats">
        ${props.stats
          .map(
            (stat) => `
              <div class="hero__stat">
                <span class="hero__stat-value">${escapeHtml(stat.value)}</span>
                <span class="hero__stat-label">${escapeHtml(stat.label)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;

  section.querySelector(".hero__column").after(TerminalCard(props.terminal));

  return section;
}

function validateHeroProps(props) {
  const required = ["firstName", "lastName", "role", "bio", "status", "stats", "terminal"];
  const missing = required.filter((key) => props?.[key] === undefined);
  if (missing.length > 0) {
    throw new Error(`[Hero] Props manquantes: ${missing.join(", ")}`);
  }
}
