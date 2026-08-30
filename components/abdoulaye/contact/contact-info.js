import { escapeHtml } from "../../../lib/text.js";

const ICONS = {
  email:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
  location:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  code:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 8-4 4 4 4"/><path d="m15 8 4 4-4 4"/></svg>',
};

export function ContactInfo(props) {
  const rows = [
    { icon: "email", label: "Email", value: props.email, href: props.email ? `mailto:${props.email}` : null },
    { icon: "phone", label: "Téléphone", value: props.phone, href: props.phone ? `tel:${props.phone.replace(/\s+/g, "")}` : null },
    { icon: "location", label: "Localisation", value: props.location, href: null },
    { icon: "code", label: "GitHub", value: props.github, href: props.github ? `https://${props.github.replace(/^https?:\/\//, "")}` : null },
  ].filter((row) => row.value);

  const container = document.createElement("div");
  container.className = "contact-info";

  container.innerHTML = rows
    .map(
      (row) => `
        <div class="contact-info__row">
          <span class="contact-info__icon">${ICONS[row.icon]}</span>
          <div class="contact-info__text">
            <span class="contact-info__label">${escapeHtml(row.label)}</span>
            ${row.href
              ? `<a class="contact-info__value" href="${escapeHtml(row.href)}" target="_blank" rel="noopener">${escapeHtml(row.value)}</a>`
              : `<span class="contact-info__value">${escapeHtml(row.value)}</span>`}
          </div>
        </div>
      `,
    )
    .join("");

  return container;
}
