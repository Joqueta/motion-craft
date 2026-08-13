/**
 * Hero "Contact Me" : portrait en fond + titre géant en surimpression.
 * @param {Object} props
 * @param {{url: string, alt: string}} props.portrait
 * @returns {HTMLElement}
 */
export function ContactHero(props) {
    if (!props?.portrait?.url) {
        throw new Error("[ContactHero] props.portrait.url est requis");
    }

    const section = document.createElement("section");
    section.className = "contact-hero";

    section.innerHTML = `
    <img class="contact-hero__portrait" src="${props.portrait.url}" alt="${props.portrait.alt}" />
    <h1 class="contact-hero__heading" aria-hidden="true">
      <span>Contact</span><span>Me</span>
    </h1>
  `;

    return section;
}