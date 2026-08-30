import setMeta from "../../lib/seo.js";
import { Layout } from "../../components/abdoulaye/layout.js";
import { ContactInfo } from "../../components/abdoulaye/contact/contact-info.js";
import { ContactForm } from "../../components/abdoulaye/contact/contact-form.js";

import { fetchProfile } from "../../services/abdoulaye-content-service.js";

export async function ContactPage() {
  const shell = document.createElement("div");
  shell.className = "page page--abdoulaye page--contact";
  shell.innerHTML = `<p class="loading">Chargement…</p>`;

  try {
    const profile = await fetchProfile();

    setMeta({
      title: `Contact — ${profile.firstName} ${profile.lastName}`,
      description: `Contactez ${profile.firstName} ${profile.lastName}.`,
    });

    const content = document.createElement("section");
    content.className = "contact-page";
    content.innerHTML = `<h1 class="contact-page__title">Contact</h1>`;

    const grid = document.createElement("div");
    grid.className = "contact-page__grid";
    grid.appendChild(ContactInfo(profile));
    grid.appendChild(ContactForm({ sendLabel: "Envoyer" }));
    content.appendChild(grid);

    return Layout(content, profile);
  } catch (error) {
    shell.innerHTML = `<p class="error">Erreur de chargement : ${error.message}</p>`;
    console.error("[ContactPage]", error);
    return shell;
  }
}
