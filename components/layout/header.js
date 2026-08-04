import defineComponent from "../../lib/props.js";
import Link from "../router/link.js";
import ThemeToggle from "../ui/theme-toggle.js";
import { initials } from "../../lib/text.js";

const NAV_ITEMS = [
  { to: "/", label: "Accueil" },
  { to: "/mentions-legales", label: "Mentions légales" },
];

const Header = defineComponent(
  "Header",
  {
    name: { type: "string", default: "" },
    path: { type: "string", default: "/" },
  },
  ({ name, path }) => ({
    type: "header",
    attributes: [["class", ["site-header"]]],
    children: [
      {
        type: "div",
        attributes: [["class", ["site-header__inner", "container"]]],
        children: [
          Link({
            to: "/",
            className: "brand",
            children: [
              {
                type: "span",
                attributes: [["class", ["brand__badge"]], ["aria-hidden", "true"]],
                children: [initials(name) || "P"],
              },
              {
                type: "span",
                attributes: [["class", ["brand__name"]]],
                children: [name || "Mon portfolio"],
              },
            ],
          }),
          {
            type: "div",
            attributes: [["class", ["site-header__end"]]],
            children: [
              {
                type: "nav",
                attributes: [["class", ["site-nav"]], ["aria-label", "Navigation principale"]],
                children: NAV_ITEMS.map((item) => ({
                  ...Link({
                    to: item.to,
                    label: item.label,
                    className: "site-nav__link",
                    active: item.to === "/" ? path === "/" : path.startsWith(item.to),
                  }),
                  key: item.to,
                })),
              },
              ThemeToggle(),
              Link({
                to: "/admin",
                label: "Back-office",
                className: "button button--accent",
                active: path.startsWith("/admin"),
              }),
            ],
          },
        ],
      },
    ],
  }),
);

export default Header;
