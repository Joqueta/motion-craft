import { escapeHtml } from "../../../lib/text.js";

export function ContactInfo(props) {
  const rows = [
    { label: "Email", value: props.email, href: props.email ? `mailto:${props.email}` : null },
    { label: "Téléphone", value: props.phone, href: props.phone ? `tel:${props.phone.replace(/\s+/g, "")}` : null },
    { label: "Localisation", value: props.location, href: null },
    { label: "GitHub", value: props.github, href: props.github ? `https://${props.github.replace(/^https?:\/\//, "")}` : null },
  ].filter((row) => row.value);

  const container = document.createElement("div");
  container.className = "contact-info";

  container.innerHTML = rows
    .map(
      (row) => `
        <div class="contact-info__row">
          <span class="contact-info__label">${escapeHtml(row.label)}</span>
          ${row.href
            ? `<a class="contact-info__value" href="${escapeHtml(row.href)}" target="_blank" rel="noopener">${escapeHtml(row.value)}</a>`
            : `<span class="contact-info__value">${escapeHtml(row.value)}</span>`}
        </div>
      `,
    )
    .join("");

  return container;
}
