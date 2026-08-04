import "../../lib/interpolate.js";
import defineComponent from "../../lib/props.js";

const Footer = defineComponent(
  "Footer",
  {
    name: { type: "string", default: "" },
    links: { type: "array", default: [] },
    source: { type: "string", default: "local" },
  },
  ({ name, links, source }) => ({
    type: "footer",
    attributes: [["class", ["site-footer"]]],
    children: [
      {
        type: "div",
        attributes: [["class", ["site-footer__inner", "container"]]],
        children: [
          {
            type: "p",
            attributes: [["class", ["site-footer__copy"]]],
            children: [
              "© {{ year }} {{ name }} — site généré avec Vanilla-Engine".interpolate({
                year: new Date().getFullYear(),
                name: name || "Portfolio",
              }),
            ],
          },
          {
            type: "ul",
            attributes: [["class", ["site-footer__links"]]],
            children: links
              .filter((link) => link.url)
              .map((link) => ({
                type: "li",
                key: link.url,
                children: [
                  {
                    type: "a",
                    attributes: [
                      ["href", link.url],
                      ["target", "_blank"],
                      ["rel", "noopener noreferrer"],
                    ],
                    children: [link.label || link.url],
                  },
                ],
              })),
          },
          {
            type: "p",
            attributes: [["class", ["site-footer__source"]]],
            children: [source === "cms" ? "Contenus servis par Strapi" : "Contenus servis en local"],
          },
        ],
      },
    ],
  }),
);

export default Footer;
