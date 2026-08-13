import { Nav } from "../../components/fritzi/nav.js";
import { AboutHero } from "../../components/fritzi/about/about-hero.js";
import { AboutSkillsSection } from "../../components/fritzi/about/about-skills-section.js";
import { ContactFooter } from "../../components/fritzi/contact-footer.js";

import { profileMock } from "../../mocks/fritzi/profile-mock.js";
import { contactMock, aboutMock } from "../../mocks/fritzi/content-mock.js";
import { aboutHeroMock, offeringsWithLinksMock } from "../../mocks/fritzi/about-mock.js";

/** Simule un futur fetch Strapi (lib/cms.js -> fetchOne("fritzi-page-about")) */
function fakeFetchAboutData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                hero: aboutHeroMock,
                skillsContent: aboutMock,
                offerings: offeringsWithLinksMock
            });
        }, 200);
    });
}

/**
 * Rendu de la page About.
 * @returns {Promise<HTMLElement>}
 */
export async function AboutPage() {
    const page = document.createElement("div");
    page.className = "page page--about";
    page.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const data = await fakeFetchAboutData();
        page.innerHTML = "";

        page.appendChild(Nav({ logo: profileMock.logo, year: profileMock.year }));
        page.appendChild(AboutHero(data.hero));
        page.appendChild(
            AboutSkillsSection({ content: data.skillsContent, offerings: data.offerings })
        );
        page.appendChild(ContactFooter(contactMock));
    } catch (error) {
        page.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[AboutPage]", error);
    }

    return page;
}