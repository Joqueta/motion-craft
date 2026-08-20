import { FeaturedProjectCard } from "./featured-project-card.js";
import { isRouterActive } from "../../router/browser-router.js";

/**
 * Section "Featured Projects" : titre en 3 colonnes (Featured / cadre / Projects)
 * puis une grille en 3 colonnes (carte gauche / cadre décoratif vide / carte droite),
 * avec décalage vertical en quinconce et coins cornés sur les cartes.
 *
 * @param {Object} props
 * @param {Array} propsprojects - exactement 2 attendus pour le layout gauche/droite
 * @returns {HTMLElement}
 */
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

  const fromRouter = isRouterActive();
  const viewAllHref = fromRouter ? "/fritzi/work" : "./work.html";

  const footer = document.createElement("div");
  footer.className = "featured__footer";
  footer.innerHTML = `
    <p class="featured__note">
      Lorem ipsum dolor sit amet consectetur. Aliquam sem elementum egestas ante
      dignissim eget mollis. Nunc sodales elementum sem gravida. Leo senectus sed
      adipiscing.
    </p>
    <a class="btn btn--outline" href="${viewAllHref}"${fromRouter ? " data-route" : ""}>View all</a>
  `;
  section.appendChild(footer);

  return section;
}

function validateFeaturedProjectsProps(props) {
  if (!Array.isArray(props?.projects)) {
    throw new Error("[FeaturedProjects] props.projects doit être un tableau");
  }
}