import setMeta from "../lib/seo.js";
import Link from "../components/router/link.js";
import CookieBanner from "../components/ui/cookie-banner.js";
import ThemeToggle from "../components/ui/theme-toggle.js";
import TeamCard from "../components/ui/team-card.js";
import MarketingFooter from "../components/layout/marketing-footer.js";

const TEAM = [
  { name: "FROIS Fritzi", role: "Dev fullstack", to: "/fritzi" },
  { name: "DIAGNE Abdoulaye", role: "Dev fullstack", to: "/abdoulaye" },
  { name: "VIEDUEIRA Mathis", role: "Dev fullstack", to: "/mathis" },
];

export default function MarketingHomePage({ path = "/" } = {}) {
  setMeta({
    title: "MotionCraft — portfolios dynamiques pour créatifs",
    description: "Un portfolio qui montre votre travail, pas seulement qui le décrit.",
  });

  return {
    type: "div",
    attributes: [["class", ["app"]]],
    children: [
      {
        type: "a",
        attributes: [["href", "#contenu"], ["class", ["skip-link"]]],
        children: ["Aller au contenu principal"],
      },
      { type: "div", attributes: [["class", ["decor"]], ["aria-hidden", "true"]] },
      {
        type: "header",
        attributes: [["class", ["marketing-nav"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["marketing-nav__inner", "container"]]],
            children: [
              Link({
                to: "/",
                className: "brand",
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
              }),
              {
                type: "div",
                attributes: [["class", ["marketing-nav__actions"]]],
                children: [
                  ThemeToggle(),
                  Link({ to: "/connexion", label: "Connexion", className: "button button--ghost" }),
                  Link({ to: "/inscription", label: "Inscription", className: "button button--primary" }),
                ],
              },
            ],
          },
        ],
      },
      {
        type: "main",
        attributes: [["id", "contenu"], ["class", ["app__main", "marketing-hero"]], ["tabindex", "-1"]],
        children: [
          {
            type: "div",
            attributes: [["class", ["container", "marketing-hero__inner"]]],
            children: [
              {
                type: "img",
                attributes: [
                  ["class", ["marketing-hero__mark"]],
                  ["src", "/assets/motioncraft-mark.svg"],
                  ["alt", ""],
                  ["aria-hidden", "true"],
                ],
              },
              { type: "h1", children: ["MotionCraft"] },
              {
                type: "p",
                attributes: [["class", ["marketing-hero__tagline"]]],
                children: ["Un portfolio qui montre votre travail, pas seulement qui le décrit."],
              },
            ],
          },
        ],
      },
      {
        type: "section",
        attributes: [["class", ["marketing-team"]], ["aria-label", "Équipe"]],
        children: [
          {
            type: "div",
            attributes: [["class", ["container", "marketing-team__inner"]]],
            children: [
              { type: "h2", attributes: [["class", ["marketing-team__title"]]], children: ["L'équipe"] },
              {
                type: "div",
                attributes: [["class", ["card-grid", "marketing-team__grid"]]],
                children: TEAM.map((member) => ({ ...TeamCard(member), key: member.to })),
              },
            ],
          },
        ],
      },
      MarketingFooter(),
      CookieBanner(),
    ],
  };
}
