import { Nav } from "../../components/fritzi/nav.js";
import { AboutHero } from "../../components/fritzi/about/about-hero.js";
import { SkillsSection } from "../../components/fritzi/shared/skills-section.js";
import { ContactFooter } from "../../components/fritzi/contact-footer.js";
import { attachA11yToggle } from "../../components/fritzi/a11y-toggle.js";

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

        const hero = AboutHero(data.hero);
        hero.id = "contenu";
        hero.tabIndex = -1;

        page.appendChild(Nav({ logo: profile.logo, year: profile.year }));
        page.appendChild(hero);
        page.appendChild(
            SkillsSection({ content: data.skillsContent, offerings: data.offerings, projects: data.projects })
        );
        page.appendChild(ContactFooter(contact));
    } catch (error) {
        page.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[AboutPage]", error);
    }

    attachA11yToggle(page);
    return page;
}