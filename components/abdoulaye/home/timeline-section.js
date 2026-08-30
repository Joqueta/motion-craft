import { escapeHtml } from "../../../lib/text.js";

function timelineItems(items) {
  return items
    .map(
      (item, index) => `
        <div class="timeline__item">
          <span class="timeline__index">${String(index + 1).padStart(2, "0")}</span>
          <div class="timeline__content">
            <span class="timeline__period">${escapeHtml(item.period)}</span>
            <h3 class="timeline__title">${escapeHtml(item.title)}</h3>
            ${item.place ? `<span class="timeline__place">${escapeHtml(item.place)}</span>` : ""}
            ${item.description ? `<p class="timeline__description">${escapeHtml(item.description)}</p>` : ""}
          </div>
        </div>
      `,
    )
    .join("");
}

export function TimelineSection(props) {
  const section = document.createElement("section");
  section.className = "timeline";

  section.innerHTML = `
    <div class="timeline__block">
      <h2 class="timeline__heading">Expérience professionnelle</h2>
      ${timelineItems(props.experience ?? [])}
    </div>
    <div class="timeline__block">
      <h2 class="timeline__heading">Formation</h2>
      ${timelineItems(props.education ?? [])}
    </div>
  `;

  return section;
}
