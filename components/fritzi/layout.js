import { Nav } from "./nav.js";
import { ContactFooter } from "./contact-footer.js";
import { attachA11yToggle } from "./a11y-toggle.js";
import { profileMock } from "../../mocks/fritzi/profile-mock.js";
import { contactMock } from "../../mocks/fritzi/content-mock.js";

export function Layout(content) {
    const wrapper = document.createDocumentFragment();

    wrapper.appendChild(Nav({ logo: profileMock.logo, year: profileMock.year }));

    const skipTarget = content.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? content.firstElementChild : content;
    if (skipTarget) {
        skipTarget.id = "contenu";
        skipTarget.tabIndex = -1;
    }
    wrapper.appendChild(content);

    wrapper.appendChild(ContactFooter(contactMock));

    const root = document.createElement("div");
    root.className = "page page--fritzi";
    root.appendChild(wrapper);

    return attachA11yToggle(root);
}