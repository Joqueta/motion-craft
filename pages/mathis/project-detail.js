import setMeta from "../../lib/seo.js";
import { Layout } from "../../components/mathis/layout.js";
import { DetailHeader } from "../../components/mathis/project-detail/detail-header.js";
import { DetailContent } from "../../components/mathis/project-detail/detail-content.js";

import { fetchProjectDetail, fetchProfile } from "../../services/mathis-content-service.js";

export async function ProjectDetailPage(routeProps) {
  const slug = routeProps?.params?.slug;

  const shell = document.createElement("div");
  shell.className = "page page--mathis page--project-detail";
  shell.innerHTML = `<p class="loading">Chargement…</p>`;

  try {
    const [project, profile] = await Promise.all([fetchProjectDetail(slug), fetchProfile()]);

    setMeta({
      title: `${project.title} — ${profile.firstName} ${profile.lastName}`,
      description: project.description,
      image: project.heroImage.url,
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
