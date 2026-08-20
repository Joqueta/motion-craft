import setMeta from "../lib/seo.js";
import Link from "../components/router/link.js";

export function createTeamPortfolioPage(name) {
  return function TeamPortfolioPage() {
    setMeta({
      title: `Portfolio de ${name}`,
      description: `Le portfolio public de ${name} arrive bientôt.`,
    });

    return {
      type: "div",
      attributes: [["class", ["app"]]],
      children: [
        { type: "div", attributes: [["class", ["decor"]], ["aria-hidden", "true"]] },
        {
          type: "main",
          attributes: [["id", "contenu"], ["class", ["app__main", "marketing-hero"]], ["tabindex", "-1"]],
          children: [
            {
              type: "div",
              attributes: [["class", ["container", "marketing-hero__inner"]]],
              children: [
                { type: "h1", children: [name] },
                {
                  type: "p",
                  attributes: [["class", ["marketing-hero__tagline"]]],
                  children: ["Portfolio bientôt disponible."],
                },
                Link({ to: "/", label: "Retour à l'accueil", className: "button button--primary" }),
              ],
            },
          ],
        },
      ],
    };
  };
}
