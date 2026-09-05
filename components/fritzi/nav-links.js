import { isRouterActive } from "../router/browser-router.js";

const NAV_ITEMS = [
  { label: "Home", route: "/fritzi", staticHref: "./#" },
  { label: "Work", route: "/fritzi/work", staticHref: "/fritzi/work.html" },
  { label: "About / Services", route: "/fritzi/about", staticHref: "/fritzi/about.html" },
];

export function getNavLinks() {
  const dataRoute = isRouterActive();
  return NAV_ITEMS.map(({ label, route, staticHref }) => ({
    label,
    href: dataRoute ? route : staticHref,
    dataRoute,
  }));
}
