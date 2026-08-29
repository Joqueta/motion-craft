import { Nav } from "../../components/fritzi/nav.js";
import { WorkHeader } from "../../components/fritzi/work/work-header.js";
import { ProjectCarousel } from "../../components/fritzi/work/project-carousel.js";
import { ContactFooter } from "../../components/fritzi/contact-footer.js";
import { attachA11yToggle } from "../../components/fritzi/a11y-toggle.js";

import { fetchWorkData, fetchProfile, fetchContactInfo } from "../../services/fritzi-content-service.js";

/**
 * Rendu de la page Work.
 * @returns {Promise<HTMLElement>}
 */
export async function WorkPage() {
    const page = document.createElement("div");
    page.className = "page page--fritzi page--work";
    page.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const [projects, profile, contact] = await Promise.all([
            fetchWorkData(),
            fetchProfile(),
            fetchContactInfo(),
        ]);
        page.innerHTML = "";

        const header = WorkHeader({
            title: "Work",
            eyebrow: `${projects.length} projects featured`
        });
        header.id = "contenu";
        header.tabIndex = -1;

        page.appendChild(Nav({ logo: profile.logo, year: profile.year }));
        page.appendChild(header);
        page.appendChild(ProjectCarousel({ projects }));
        page.appendChild(ContactFooter(contact));
    } catch (error) {
        page.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[WorkPage]", error);
    }

    attachA11yToggle(page);
    return page;
}
