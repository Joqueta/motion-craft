import { Layout } from "../../components/fritzi/layout.js";
import { ContactHero } from "../../components/fritzi/contact/contact-hero.js";
import { ContactForm } from "../../components/fritzi/contact/contact-form.js";
import { fetchContactData } from "../../services/fritzi-content-service.js";

/**
 * Rendu de la page Contact.
 * @returns {Promise<HTMLElement>}
 */
export async function ContactPage() {
    const page = document.createElement("div");
    page.className = "page page--fritzi page--contact";
    page.innerHTML = `<p class="loading">Chargement…</p>`;

    try {
        const data = await fetchContactData();
        page.innerHTML = "";

        const hero = ContactHero({ portrait: data.portrait });
        hero.appendChild(ContactForm({ sendLabel: "Send me" }));

        return Layout(hero);
    } catch (error) {
        page.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
        console.error("[ContactPage]", error);
        return page;
    }
}
