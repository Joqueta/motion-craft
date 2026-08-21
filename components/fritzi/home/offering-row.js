import { escapeHtml } from "../../../lib/text.js";
import { isRouterActive } from "../../router/browser-router.js";

/**
 * Une ligne "offering" (compétence) dans la liste.
 * @param {Object} props
 * @param {string} props.number
 * @param {string} props.title
 * @param {string} props.tag
 * @param {string} props.tools
 * @param {Array<string>} props.work
 * @param {Array<{label: string, slug: string}>} [props.relatedWork]
 * @param {Array<{slug: string, cover: {url: string, alt: string}}>} [props.projects]
 * @returns {HTMLElement}
 */
export function OfferingRow(props) {
  validateOfferingProps(props);

  const row = document.createElement("div");
  row.className = "offering-row";

  const slugByLabel = buildSlugByLabel(props.relatedWork);
  const coverByLabel = buildCoverByLabel(props.relatedWork, props.projects);
  const fromRouter = isRouterActive();

  const workLinks = props.work
    .map((label) => {
      const slug = slugByLabel.get(normalizeLabel(label));
      const cover = coverByLabel.get(normalizeLabel(label));

      if (!slug) return `<p class="offering-row__work-label">${escapeHtml(label)}</p>`;

      const coverAttrs = cover
        ? ` data-cover-url="${escapeHtml(cover.url)}" data-cover-alt="${escapeHtml(cover.alt)}"`
        : "";
      const href = escapeHtml(fromRouter ? `/fritzi/projets/${slug}` : `./projet.html?slug=${slug}`);
      return `<a class="offering-row__work-label" href="${href}"${fromRouter ? " data-route" : ""}${coverAttrs}>${escapeHtml(label)}</a>`;
    })
    .join("");

  row.innerHTML = `
    <div class="offering-row__body">
      <div class="offering-row__header">
        <div class="offering-row__top">
          <span class="offering-row__number">${escapeHtml(props.number)}</span>
          <h3 class="offering-row__title">${escapeHtml(props.title)}</h3>
        </div>
        <span class="offering-row__tag">
          <span class="offering-row__tag-text">${escapeHtml(props.tag)} <span class="offering-row__arrow" aria-hidden="true">↓</span></span>
          <img class="offering-row__tag-cover" alt="" aria-hidden="true" />
        </span>
      </div>
      <div class="offering-row__bottom">
        <p class="offering-row__tools">${escapeHtml(props.tools)}</p>
        <div class="offering-row__work">
          ${workLinks}
        </div>
      </div>
    </div>
  `;

  bindWorkCoverPreview(row);

  return row;
}

function normalizeLabel(label) {
  return String(label).trim().toLowerCase();
}

function buildSlugByLabel(relatedWork) {
  return new Map((relatedWork ?? []).map((item) => [normalizeLabel(item.label), item.slug]));
}

function buildCoverByLabel(relatedWork, projects) {
  const coverBySlug = new Map(
    (projects ?? []).filter((project) => project.cover?.url).map((project) => [project.slug, project.cover])
  );

  return new Map(
    (relatedWork ?? [])
      .filter((item) => coverBySlug.has(item.slug))
      .map((item) => [normalizeLabel(item.label), coverBySlug.get(item.slug)])
  );
}

/**
 * Au survol d'un work-label relié à un projet, le tag de la ligne bascule
 * pour afficher la cover de ce projet, et revient au texte quand la souris
 * quitte le label.
 */
function bindWorkCoverPreview(row) {
  const tag = row.querySelector(".offering-row__tag");
  const cover = row.querySelector(".offering-row__tag-cover");
  const labels = row.querySelectorAll(".offering-row__work-label[data-cover-url]");

  labels.forEach((label) => {
    const show = () => {
      cover.src = label.dataset.coverUrl;
      cover.alt = label.dataset.coverAlt ?? "";
      tag.classList.add("is-previewing");
    };
    const hide = () => tag.classList.remove("is-previewing");

    label.addEventListener("mouseenter", show);
    label.addEventListener("mouseleave", hide);
  });
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
