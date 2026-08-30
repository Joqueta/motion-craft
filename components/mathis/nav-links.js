import { isRouterActive, currentLocation } from "../router/browser-router.js";

const NAV_ITEMS = [
  { label: "Accueil", route: "/mathis", staticHref: "/mathis" },
  { label: "À propos", route: "/mathis#apropos", staticHref: "/mathis#apropos" },
  { label: "Projets", route: "/mathis#projets", staticHref: "/mathis#projets" },
  { label: "Contact", route: "/mathis#contact", staticHref: "/mathis#contact" },
];

export function getNavLinks() {
  const dataRoute = isRouterActive();
  const currentPath = dataRoute ? currentLocation().path : window.location.pathname;

  return NAV_ITEMS.map(({ label, route, staticHref }) => ({
    label,
    href: dataRoute ? route : staticHref,
    dataRoute,
    active: !route.includes("#") && route === currentPath,
  }));
}
