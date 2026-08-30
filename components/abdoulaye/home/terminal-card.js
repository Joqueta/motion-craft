import { escapeHtml } from "../../../lib/text.js";

export function TerminalCard(props) {
  const lines = Array.isArray(props?.lines) ? props.lines : [];

  const card = document.createElement("div");
  card.className = "terminal-card";

  card.innerHTML = `
    <div class="terminal-card__bar">
      <span class="terminal-card__dot"></span>
      <span class="terminal-card__dot"></span>
      <span class="terminal-card__dot"></span>
      <span class="terminal-card__filename">${escapeHtml(props?.filename ?? "")}</span>
    </div>
    <pre class="terminal-card__body">${lines.map((line) => escapeHtml(line)).join("\n")}</pre>
  `;

  return card;
}
