import { Nav } from "../../components/fritzi/nav.js";
import { ProjectSubbar } from "../../components/fritzi/projet/project-subbar.js";
import { ProjectHeader } from "../../components/fritzi/projet/projet-header.js";
import { FramedImage } from "../../components/fritzi/projet/framed-image.js";
import { ProjectOverview } from "../../components/fritzi/projet/projet-overview.js";
import { TextImageBlock } from "../../components/fritzi/projet/text-image.js";
import { ProjectChallenge } from "../../components/fritzi/projet/challenge.js";
import { NextProject } from "../../components/fritzi/projet/next-project.js";
import { ContactFooter } from "../../components/fritzi/contact-footer.js";

import { fetchProjectDetail, fetchProfile, fetchContactInfo } from "../../services/fritzi-content-service.js";

/**
 * Rendu de la page détail projet.
 * @param {string|{params: {slug: string}}} props - slug direct (appel historique,
 *   ex. fritzi/projet.html) ou props standard du routeur ({params, path, query, pattern}).
 * @returns {Promise<HTMLElement>}
 */
export async function ProjectDetailPage(props) {
    const fromRouter = typeof props !== "string";
    const slug = fromRouter ? props?.params?.slug : props;
    const closeHref = fromRouter ? "/fritzi" : "../index.html";

    const page = document.createElement("div");
    page.className = "page page--fritzi page--project-detail";
    page.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const [project, profile, contact] = await Promise.all([
            fetchProjectDetail(slug),
            fetchProfile(),
            fetchContactInfo(),
        ]);
        page.innerHTML = "";

        page.appendChild(Nav({ logo: profile.logo, year: profile.year }));
        page.appendChild(
            ProjectSubbar({ eyebrow: project.eyebrow, closeHref })
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
        if (project.nextProject) page.appendChild(NextProject(project.nextProject));
        page.appendChild(ContactFooter(contact));
    } catch (error) {
        page.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[ProjectDetailPage]", error);
    }

    return page;
}