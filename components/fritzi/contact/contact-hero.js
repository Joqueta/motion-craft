export function ContactHero(props) {
  if (!props?.portrait?.url) {
    throw new Error("[ContactHero] props.portrait.url est requis");
  }

  const section = document.createElement("section");
  section.className = "contact-hero";

  section.innerHTML = `
    <h1 class="visually-hidden">Come say hi</h1>
  `;

  return section;
}