import { ProjectCard } from "./project-card.js";

export function ProjectGrid(props) {
  const grid = document.createElement("div");
  grid.className = "mathis-project-grid";

  props.projects.forEach((project) => grid.appendChild(ProjectCard(project)));

  return grid;
}
