const NAV_ITEMS = [
  { label: "Accueil", href: "#contenu" },
  { label: "À propos", href: "#apropos" },
  { label: "Projets", href: "#projets" },
  { label: "Contact", href: "#contact" },
];

export function getNavLinks() {
  return NAV_ITEMS.map(({ label, href }) => ({
    label,
    href,
    dataRoute: false,
    active: false,
  }));
}
