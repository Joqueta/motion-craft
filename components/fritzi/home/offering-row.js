/**
 * Une ligne "offering" (compétence) dans la liste.
 * @param {Object} props
 * @param {string} props.number
 * @param {string} props.title
 * @param {string} props.tag
 * @param {string} props.tools
 * @returns {HTMLElement}
 */
export function OfferingRow(props) {
  validateOfferingProps(props);

  const row = document.createElement("div");
  row.className = "offering-row";

  const workLinks = props.work
    .map((label) => `<p class="offering-row__work-label">${label}</p>`)
    .join("");

  row.innerHTML = `
    <div class="offering-row__body">
      <div class="offering-row__header">
        <div class="offering-row__top">
          <span class="offering-row__number">${props.number}</span>
          <h3 class="offering-row__title">${props.title}</h3>
        </div>
        <span class="offering-row__tag">
          ${props.tag} <span class="offering-row__arrow" aria-hidden="true">↓</span>
        </span>
      </div>
      <div class="offering-row__bottom">
        <p class="offering-row__tools">${props.tools}</p>
        <div class="offering-row__work">
          ${workLinks}
        </div>
      </div>
    </div>
  `;

  return row;
}

function validateOfferingProps(props) {
  const required = ["number", "title", "tag", "tools", "work"];
  const missing = required.filter((key) => !props[key]);
  if (missing.length > 0) {
    throw new Error(`[OfferingRow] Props manquantes: ${missing.join(", ")}`);
  }
  if (!Array.isArray(props.work) || props.work.length === 0) {
    throw new Error(`[OfferingRow] props.work doit être un tableau non vide`);
  }
}