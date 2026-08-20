import Link from "../../router/link.js";

const NAV_ITEMS = [
  { to: "/fritzi/admin", label: "Projects" },
  { to: "/fritzi/admin/pages/home", label: "Home" },
  { to: "/fritzi/admin/pages/about", label: "About" },
  { to: "/fritzi/admin/pages/contact", label: "Contact" },
  { to: "/fritzi/admin/pages/profil", label: "Profile" },
];

export function isNavLinkActive(target, path) {
  if (target === "/fritzi/admin") {
    return path === "/fritzi/admin" || path.startsWith("/fritzi/admin/projets");
  }
  return path.startsWith(target);
}

export function AdminNav(path = "") {
  return {
    type: "nav",
    attributes: [
      ["class", ["admin__nav"]],
      ["aria-label", "Back-office navigation"],
    ],
    children: NAV_ITEMS.map((item) => ({
      ...Link({
        to: item.to,
        label: item.label,
        className: "admin__tab",
        active: isNavLinkActive(item.to, path),
      }),
      key: item.to,
    })),
  };
}
