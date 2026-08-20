import { Nav } from "../../components/fritzi/nav.js";
import { AboutHero } from "../../components/fritzi/about/about-hero.js";
import { AboutSkillsSection } from "../../components/fritzi/about/about-skills-section.js";
import { ContactFooter } from "../../components/fritzi/contact-footer.js";

import { fetchAboutData, fetchProfile, fetchContactInfo } from "../../services/fritzi-content-service.js";

/**
 * Rendu de la page About.
 * @returns {Promise<HTMLElement>}
 */
export async function AboutPage() {
    const page = document.createElement("div");
    page.className = "page page--fritzi page--about";
    page.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const [data, profile, contact] = await Promise.all([
            fetchAboutData(),
            fetchProfile(),
            fetchContactInfo(),
        ]);
        page.innerHTML = "";

        page.appendChild(Nav({ logo: profile.logo, year: profile.year }));
        page.appendChild(AboutHero(data.hero));
        page.appendChild(
            AboutSkillsSection({ content: data.skillsContent, offerings: data.offerings })
        );
        page.appendChild(ContactFooter(contact));
    } catch (error) {
        page.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[AboutPage]", error);
    }

    return page;
}