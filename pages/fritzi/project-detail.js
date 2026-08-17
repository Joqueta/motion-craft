import { Nav } from "../../components/fritzi/nav.js";
import { ProjectSubbar } from "../../components/fritzi/projet/project-subbar.js";
import { ProjectHeader } from "../../components/fritzi/projet/projet-header.js";
import { FramedImage } from "../../components/fritzi/projet/framed-image.js";
import { ProjectOverview } from "../../components/fritzi/projet/projet-overview.js";
import { TextImageBlock } from "../../components/fritzi/projet/text-image.js";
import { ProjectChallenge } from "../../components/fritzi/projet/challenge.js";
import { NextProject } from "../../components/fritzi/projet/next-project.js";
import { ContactFooter } from "../../components/fritzi/contact-footer.js";

import { profileMock } from "../../mocks/fritzi/profile-mock.js";
import { contactMock } from "../../mocks/fritzi/content-mock.js";
import { projectDetailMock } from "../../mocks/fritzi/project-detail-mock.js";
/**
 * Simule un futur fetch Strapi filtré par slug
 * (à remplacer par lib/cms.js -> fetchOne("fritzi-projects", slug))
 */
function fakeFetchProjectDetail(slug) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (slug && slug !== projectDetailMock.slug) {
                reject(new Error(`Projet "${slug}" introuvable`));
                return;
            }
            resolve(projectDetailMock);
        }, 200);
    });
}

/**
 * Rendu de la page détail projet.
 * @param {string} [slug] - slug du projet à afficher (vient du routeur)
 * @returns {Promise<HTMLElement>}
 */
export async function ProjectDetailPage(slug) {
    const page = document.createElement("div");
    page.className = "page page--project-detail";
    page.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const project = await fakeFetchProjectDetail(slug);
        page.innerHTML = "";

        page.appendChild(Nav({ logo: profileMock.logo, year: profileMock.year }));
        page.appendChild(
            ProjectSubbar({ eyebrow: project.eyebrow, closeHref: "../index.html" })
        );
        page.appendChild(ProjectHeader({ title: project.title, meta: project.meta }));
        page.appendChild(
            FramedImage({ ...project.heroImage, className: "project-hero-image" })
        );
        page.appendChild(ProjectOverview(project.overview));
        page.appendChild(
            TextImageBlock({
                eyebrow: project.discovery.eyebrow,
                paragraphs: project.discovery.paragraphs,
                image: project.discovery.image,
                order: "text-first"
            })
        );
        page.appendChild(ProjectChallenge(project.challenge));
        page.appendChild(
            TextImageBlock({
                eyebrow: project.outcome.eyebrow,
                heading: project.outcome.heading,
                paragraphs: project.outcome.paragraphs,
                image: project.outcome.image,
                order: "image-first"
            })
        );
        page.appendChild(NextProject(project.nextProject));
        page.appendChild(ContactFooter(contactMock));
    } catch (error) {
        page.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[ProjectDetailPage]", error);
    }

    return page;
}