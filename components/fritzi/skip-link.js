/**
 * Lien d'évitement, visible uniquement au focus clavier (CSS dans styles/base.css).
 * @returns {HTMLAnchorElement}
 */
export function SkipLink() {
  const link = document.createElement("a");
  link.className = "skip-link";
  link.href = "#contenu";
  link.textContent = "Aller au contenu principal";
  return link;
}
