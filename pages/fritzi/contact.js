import { Layout } from "../../components/fritzi/layout.js";
import { ContactHero } from "../../components/fritzi/contact/contact-hero.js";
import { ContactForm } from "../../components/fritzi/contact/contact-form.js";
import { fetchContactData } from "../../services/fritzi-content-service.js";

export async function ContactPage() {
    const data = await fetchContactData();
    const hero = ContactHero({ portrait: data.portrait });
    hero.appendChild(ContactForm({ sendLabel: "Send me" }));

    return Layout(hero);
}
