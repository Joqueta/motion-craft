import { Layout } from "../../components/fritzi/layout.js";
import { Hero } from "../../components/fritzi/home/hero.js";
import { FeaturedProjects } from "../../components/fritzi/home/featured-project.js";
import { AboutMe } from "../../components/fritzi/home/about-me.js";
import { SkillsSection } from "../../components/fritzi/home/skills-section.js";

import { fetchHomeData } from "../../services/fritzi-content-service.js";

/**
 * Rendu de la page Home.
 * @returns {Promise<HTMLElement>}
 */
export async function HomePage() {
    const shell = document.createElement("div");
    shell.className = "page page--fritzi page--home";
    shell.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const data = await fetchHomeData();

        const content = document.createDocumentFragment();

        content.appendChild(
            Hero({
                firstName: data.profile.firstName,
                lastName: data.profile.lastName,
                role: data.profile.role,
                bio: data.profile.bio,
                status: data.profile.status,
                location: data.profile.location,
                logo: data.profile.logo
            })
        );

        content.appendChild(
            FeaturedProjects({
                projects: data.projects
            })
        );

        content.appendChild(AboutMe(data.aboutMe));

        content.appendChild(
            SkillsSection({
                content: data.about,
                offerings: data.offerings,
                projects: data.projects
            })
        );

        return Layout(content);
    } catch (error) {
        shell.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[HomePage]", error);
        return shell;
    }
}