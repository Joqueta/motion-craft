import Link from "../router/link.js";

export default function MarketingFooter() {
  return {
    type: "footer",
    attributes: [["class", ["marketing-footer"]]],
    children: [
      {
        type: "div",
        attributes: [["class", ["marketing-footer__inner", "container"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["brand", "marketing-footer__brand"]]],
            children: [
              {
                type: "img",
                attributes: [
                  ["class", ["marketing-nav__mark"]],
                  ["src", "/assets/motioncraft-mark.svg"],
                  ["alt", ""],
                  ["aria-hidden", "true"],
                ],
              },
              { type: "span", children: ["MotionCraft"] },
            ],
          },
          {
            type: "nav",
            attributes: [["class", ["marketing-footer__links"]], ["aria-label", "Pages légales"]],
            children: [
              Link({ to: "/mentions-legales", label: "Mentions légales" }),
              Link({ to: "/confidentialite", label: "Confidentialité" }),
              Link({ to: "/cookies", label: "Cookies" }),
              Link({ to: "/protection-des-donnees", label: "Protection des données" }),
            ],
          },
          {
            type: "p",
            attributes: [["class", ["marketing-footer__copy"]]],
            children: [`© ${new Date().getFullYear()} MotionCraft`],
          },
        ],
      },
    ],
  };
}
