import { escapeHtml } from "../../../lib/text.js";

const ICONS = {
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3.5 8.5h6V21h-6V8.5ZM12 8.5h5.75v1.7h.08c.8-1.42 2.75-2.9 5.67-2.9 6.06 0 7.19 3.6 7.19 8.28V21h-6V16.6c0-2.05-.04-4.68-3.24-4.68-3.24 0-3.74 2.28-3.74 4.53V21h-5.96V8.5Z"/></svg>',
};

export function ContactInfo(props) {
  const links = [
    { icon: "github", href: props.github, label: "GitHub" },
    { icon: "linkedin", href: props.linkedin, label: "LinkedIn" },
  ].filter((link) => link.href);

  const container = document.createElement("div");
  container.className = "mathis-contact-info";

  container.innerHTML = `
    <p class="mathis-contact-info__text">ou retrouvez moi ici :</p>
    <div class="mathis-contact-info__links">
      ${links
        .map(
          (link) => `
            <a class="mathis-contact-info__icon" href="${escapeHtml(link.href)}" target="_blank" rel="noopener" aria-label="${escapeHtml(link.label)}">
              ${ICONS[link.icon]}
            </a>
          `,
        )
        .join("")}
    </div>
  `;

  return container;
}
