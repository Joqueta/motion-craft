import { Nav } from "../../components/fritzi/nav.js";
import { WorkHeader } from "../../components/fritzi/work/work-header.js";
import { ProjectCarousel } from "../../components/fritzi/work/project-carousel.js";
import { ContactFooter } from "../../components/fritzi/contact-footer.js";

import { profileMock } from "../../mocks/fritzi/profile-mock.js";
import { contactMock } from "../../mocks/fritzi/content-mock.js";
import { workPageMock, allProjectsMock } from "../../mocks/fritzi/work-mock.js";

/** Simule un futur fetch Strapi (lib/cms.js -> fetchCollection("fritzi-projects")) */
function fakeFetchAllProjects() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(allProjectsMock), 200);
    });
}

/**
 * Rendu de la page Work.
 * @returns {Promise<HTMLElement>}
 */
export async function WorkPage() {
    const page = document.createElement("div");
    page.className = "page page--work";
    page.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const projects = await fakeFetchAllProjects();
        page.innerHTML = "";

        page.appendChild(Nav({ logo: profileMock.logo, year: profileMock.year }));
        page.appendChild(
            WorkHeader({
                title: workPageMock.title,
                eyebrow: `${projects.length} projects featured`
            })
        );
        page.appendChild(ProjectCarousel({ projects }));
        page.appendChild(ContactFooter(contactMock));
    } catch (error) {
        page.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[WorkPage]", error);
    }

    return page;
}