import { Layout } from "../../components/fritzi/layout.js";
import { ContactHero } from "../../components/fritzi/contact/contact-hero.js";
import { ContactForm } from "../../components/fritzi/contact/contact-form.js";
import { contactHeroMock } from "../../mocks/fritzi/contact-mock.js";

export async function ContactPage() {
    const hero = ContactHero(contactHeroMock);
    hero.appendChild(ContactForm({ sendLabel: "Send me" }));

    return Layout(hero);
}
