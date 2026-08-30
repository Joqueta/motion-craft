import { isRouterActive, currentLocation } from "../router/browser-router.js";

const NAV_ITEMS = [
  { label: "Accueil", route: "/abdoulaye", staticHref: "/abdoulaye" },
  { label: "À propos", route: "/abdoulaye#about", staticHref: "/abdoulaye#about" },
  { label: "Projets", route: "/abdoulaye/projets", staticHref: "/abdoulaye/projets" },
  { label: "Contact", route: "/abdoulaye/contact", staticHref: "/abdoulaye/contact" },
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
