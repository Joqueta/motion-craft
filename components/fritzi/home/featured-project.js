import { FeaturedProjectCard } from "./featured-project-card.js";
import { isRouterActive } from "../../router/browser-router.js";
import { escapeHtml } from "../../../lib/text.js";

const FRAME_IMAGE_URL = "/assets/fritzi/home/rectangle.svg";
const FRAME_IMAGE_HOVER_URL = "/assets/fritzi/home/logo-cadre-white.svg";

export function FeaturedProjects(props) {
  validateFeaturedProjectsProps(props);

  const section = document.createElement("section");
  section.className = "featured";

  section.innerHTML = `
    <div class="featured__heading">
      <span class="featured__word featured__word--left">Featured</span>
      <span class="featured__frame" aria-hidden="true"></span>
      <span class="featured__word featured__word--right">Projects</span>
    </div>
  `;

  const grid = document.createElement("div");
  grid.className = "featured__grid";

  const [leftProject, rightProject] = props.projects;

  const leftCol = document.createElement("div");
  leftCol.className = "featured__col featured__col--left";
  if (leftProject) leftCol.appendChild(FeaturedProjectCard(leftProject));

  const centerCol = document.createElement("div");
  centerCol.className = "featured__col featured__col--center";
  centerCol.innerHTML = `<span class="featured__grid-frame" aria-hidden="true"></span>`;

  const rightCol = document.createElement("div");
  rightCol.className = "featured__col featured__col--right";
  if (rightProject) rightCol.appendChild(FeaturedProjectCard(rightProject));

  grid.append(leftCol, centerCol, rightCol);
  section.appendChild(grid);

  const track = document.createElement("div");
  track.className = "featured__frame-track";

  const frameImage = document.createElement("img");
  frameImage.className = "featured__frame-image";
  frameImage.src = FRAME_IMAGE_URL;
  frameImage.alt = "";
  frameImage.setAttribute("aria-hidden", "true");
  bindFrameImageSwap(frameImage);

  track.appendChild(frameImage);
  section.appendChild(track);

  const fromRouter = isRouterActive();
  const viewAllHref = fromRouter ? "/fritzi/work" : "./work.html";

  const footer = document.createElement("div");
  footer.className = "featured__footer";
  footer.innerHTML = `
    <p class="featured__note">${escapeHtml(props.note)}</p>
    <a class="btn btn--outline" href="${viewAllHref}"${fromRouter ? " data-route" : ""}>View all</a>
  `;
  section.appendChild(footer);

  return section;
}

function validateFeaturedProjectsProps(props) {
  if (!Array.isArray(props?.projects)) {
    throw new Error("[FeaturedProjects] props.projects doit être un tableau");
  }
  if (typeof props?.note !== "string") {
    throw new Error("[FeaturedProjects] props.note doit être une chaîne");
  }
}

function bindFrameImageSwap(img) {
  let isActive = false;

  const activate = () => {
    if (isActive) return;
    isActive = true;
    img.src = FRAME_IMAGE_HOVER_URL;
  };

  img.addEventListener("mouseenter", activate);
  img.addEventListener("pointerdown", activate);
}