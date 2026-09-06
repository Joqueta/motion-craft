import setMeta from "../../lib/seo.js";
import { escapeHtml } from "../../lib/text.js";
import { Layout } from "../../components/mathis/layout.js";
import { Hero } from "../../components/mathis/home/hero.js";
import { AboutSection } from "../../components/mathis/home/about-section.js";
import { ProjectGrid } from "../../components/mathis/projects/project-grid.js";
import { ContactInfo } from "../../components/mathis/contact/contact-info.js";
import { ContactForm } from "../../components/mathis/contact/contact-form.js";

import { fetchHomeData } from "../../services/mathis-content-service.js";

export async function HomePage() {
  const shell = document.createElement("div");
  shell.className = "page page--mathis page--home";
  shell.innerHTML = `<p class="loading">Chargement…</p>`;

  try {
    const { profile, projects } = await fetchHomeData();

    setMeta({
      title: `${profile.firstName} ${profile.lastName} - ${profile.role}`,
      description: profile.bioShort,
    });

    const content = document.createDocumentFragment();

    content.appendChild(
      Hero({
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        bio: profile.bioShort,
        photo: profile.heroPhoto,
      }),
    );

    const about = AboutSection({
      bio: profile.bioLong,
      skillsLanguages: profile.skillsLanguages,
      skillsFrameworks: profile.skillsFrameworks,
      skillsTools: profile.skillsTools,
    });
    about.id = "apropos";
    content.appendChild(about);

    const projectsSection = document.createElement("section");
    projectsSection.className = "mathis-projects-section";
    projectsSection.id = "projets";
    projectsSection.innerHTML = `
      <h2 class="mathis-projects-section__title">Mes <span class="mathis-projects-section__accent">Projets</span></h2>
      <p class="mathis-projects-section__subtitle">Quelques-uns de mes derniers projets</p>
    `;
    projectsSection.appendChild(ProjectGrid({ projects }));
    content.appendChild(projectsSection);

    const contactSection = document.createElement("section");
    contactSection.className = "mathis-contact-section";
    contactSection.id = "contact";
    contactSection.innerHTML = `
      <h2 class="mathis-contact-section__title">Me <span class="mathis-contact-section__accent">contacter</span></h2>
      ${profile.contactIntro ? `<p class="mathis-contact-section__intro">${escapeHtml(profile.contactIntro)}</p>` : ""}
    `;
    contactSection.appendChild(ContactForm({ sendLabel: "Envoyer" }));
    contactSection.appendChild(ContactInfo(profile));
    content.appendChild(contactSection);

    return Layout(content, profile);
  } catch (error) {
    shell.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
    console.error("[HomePage]", error);
    return shell;
  }
}
