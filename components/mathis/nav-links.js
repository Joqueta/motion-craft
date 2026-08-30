import { isRouterActive, currentLocation } from "../router/browser-router.js";

const NAV_ITEMS = [
  { label: "Accueil", route: "/mathis", staticHref: "/mathis", hash: false },
  { label: "À propos", route: "#apropos", staticHref: "#apropos", hash: true },
  { label: "Projets", route: "#projets", staticHref: "#projets", hash: true },
  { label: "Contact", route: "#contact", staticHref: "#contact", hash: true },
];

export function getNavLinks() {
  const routerActive = isRouterActive();
  const currentPath = routerActive ? currentLocation().path : window.location.pathname;

  return NAV_ITEMS.map(({ label, route, staticHref, hash }) => ({
    label,
    href: routerActive && !hash ? route : staticHref,
    dataRoute: routerActive && !hash,
    active: !hash && route === currentPath,
  }));
}
