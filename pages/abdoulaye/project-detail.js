import setMeta from "../../lib/seo.js";
import { Layout } from "../../components/abdoulaye/layout.js";
import { DetailHeader } from "../../components/abdoulaye/project-detail/detail-header.js";
import { DetailContent } from "../../components/abdoulaye/project-detail/detail-content.js";

import { fetchProjectDetail, fetchProfile } from "../../services/abdoulaye-content-service.js";

export async function ProjectDetailPage(routeProps) {
  const slug = routeProps?.params?.slug;

  const shell = document.createElement("div");
  shell.className = "page page--abdoulaye page--project-detail";
  shell.innerHTML = `<p class="loading">Chargement…</p>`;

  try {
    const [project, profile] = await Promise.all([fetchProjectDetail(slug), fetchProfile()]);

    setMeta({
      title: `${project.title} — ${profile.firstName} ${profile.lastName}`,
      description: project.description,
      image: project.cover.url,
    });

    const content = document.createDocumentFragment();
    content.appendChild(DetailHeader(project));
    content.appendChild(DetailContent(project));

    return Layout(content, profile);
  } catch (error) {
    shell.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
    console.error("[ProjectDetailPage]", error);
    return shell;
  }
}
