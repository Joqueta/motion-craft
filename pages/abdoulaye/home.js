import setMeta from "../../lib/seo.js";
import { Layout } from "../../components/abdoulaye/layout.js";
import { Hero } from "../../components/abdoulaye/home/hero.js";
import { AboutSection } from "../../components/abdoulaye/home/about-section.js";
import { TimelineSection } from "../../components/abdoulaye/home/timeline-section.js";

import { fetchHomeData } from "../../services/abdoulaye-content-service.js";

export async function HomePage() {
  const shell = document.createElement("div");
  shell.className = "page page--abdoulaye page--home";
  shell.innerHTML = `<p class="loading">Chargement…</p>`;

  try {
    const data = await fetchHomeData();

    setMeta({
      title: `${data.profile.firstName} ${data.profile.lastName} — ${data.profile.role}`,
      description: data.profile.bioShort,
    });

    const content = document.createDocumentFragment();

    content.appendChild(
      Hero({
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        role: data.profile.role,
        bio: data.profile.bioShort,
        status: data.profile.status,
        stats: data.stats,
        terminal: data.terminal,
      }),
    );

    const about = AboutSection({
      eyebrow: "// about.me",
      heading: "À propos de moi",
      intro: data.aboutIntro,
      infoItems: data.infoItems,
      skills: data.skills,
      techTags: data.techTags,
      languages: data.languages,
      interests: data.interests,
    });
    about.id = "about";
    content.appendChild(about);

    content.appendChild(TimelineSection({ experience: data.experience, education: data.education }));

    return Layout(content, data.profile);
  } catch (error) {
    shell.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
    console.error("[HomePage]", error);
    return shell;
  }
}
