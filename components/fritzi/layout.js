import { Nav } from "./nav.js";
import { ContactFooter } from "./contact-footer.js";
import { profileMock } from "../../mocks/fritzi/profile-mock.js";
import { contactMock } from "../../mocks/fritzi/content-mock.js";

/**
 * Enveloppe le contenu d'une page avec le Nav et le Footer communs à tout le mini-site.
 * @param {HTMLElement} content - le contenu spécifique de la page (déjà construit)
 * @returns {HTMLElement}
 */
export function Layout(content) {
    const wrapper = document.createDocumentFragment();

    wrapper.appendChild(Nav({ logo: profileMock.logo, year: profileMock.year }));
    wrapper.appendChild(content);
    wrapper.appendChild(ContactFooter(contactMock));

    const root = document.createElement("div");
    root.className = "page page--fritzi";
    root.appendChild(wrapper);

    return root;
}