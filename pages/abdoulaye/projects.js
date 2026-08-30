import setMeta from "../../lib/seo.js";
import { Layout } from "../../components/abdoulaye/layout.js";
import { ProjectGrid } from "../../components/abdoulaye/projects/project-grid.js";

import { fetchProjects, fetchProfile } from "../../services/abdoulaye-content-service.js";

export async function ProjectsPage() {
  const shell = document.createElement("div");
  shell.className = "page page--abdoulaye page--projects";
  shell.innerHTML = `<p class="loading">Chargement…</p>`;

  try {
    const [projects, profile] = await Promise.all([fetchProjects(), fetchProfile()]);

    setMeta({
      title: `Projets — ${profile.firstName} ${profile.lastName}`,
      description: `${projects.length} projets réalisés par ${profile.firstName} ${profile.lastName}.`,
    });

    const content = document.createElement("section");
    content.className = "projects-page";
    content.innerHTML = `
      <span class="page-eyebrow">// mes.projets</span>
      <h1 class="projects-page__title">Mes Projets</h1>
    `;
    content.appendChild(ProjectGrid({ projects }));

    return Layout(content, profile);
  } catch (error) {
    shell.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
    console.error("[ProjectsPage]", error);
    return shell;
  }
}
