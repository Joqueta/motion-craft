import { Layout } from "../../components/fritzi/layout.js";
import { Hero } from "../../components/fritzi/home/hero.js";
import { FeaturedProjects } from "../../components/fritzi/home/featured-project.js";
import { AboutMe } from "../../components/fritzi/home/about-me.js";
import { SkillsSection } from "../../components/fritzi/home/skills-section.js";

import { profileMock } from "../../mocks/fritzi/profile-mock.js";
import { featuredProjectsMock } from "../../mocks/fritzi/projects-mock.js";
import {
    aboutMock,
    aboutMeMock,
    offeringsMock
} from "../../mocks/fritzi/content-mock.js";

/** Simule un futur fetch Strapi (à remplacer par lib/cms.js) */
function fakeFetchHomeData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                profile: profileMock,
                projects: featuredProjectsMock,
                about: aboutMock,
                aboutMe: aboutMeMock,
                offerings: offeringsMock
            });
        }, 200);
    });
}

/**
 * Rendu de la page Home.
 * @returns {Promise<HTMLElement>}
 */
export async function HomePage() {
    const shell = document.createElement("div");
    shell.className = "page page--home";
    shell.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const data = await fakeFetchHomeData();

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
                projects: data.projects,
                centerImage: {
                    url: "https://placehold.co/500x900/1a1a1a/EDE9DD?text=Fritzi",
                    alt: "Portrait de Fritzi Frois"
                }
            })
        );

        content.appendChild(AboutMe(data.aboutMe));

        content.appendChild(
            SkillsSection({
                content: data.about,
                offerings: data.offerings
            })
        );

        return Layout(content);
    } catch (error) {
        shell.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[HomePage]", error);
        return shell;
    }
}