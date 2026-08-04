import setMeta from "../lib/seo.js";
import Layout from "../components/layout/layout.js";
import Link from "../components/router/link.js";

export default function NotFoundPage({ path = "/" } = {}) {
  setMeta({ title: "Page introuvable", description: "La page demandée n'existe pas." });

  return Layout({
    path,
    className: "page page--error",
    children: [
      {
        type: "div",
        attributes: [["class", ["container", "error-page"]]],
        children: [
          {
            type: "img",
            attributes: [
              ["class", ["error-page__mark"]],
              ["src", "/assets/motioncraft-mark.svg"],
              ["alt", ""],
              ["aria-hidden", "true"],
            ],
          },
          { type: "p", attributes: [["class", ["error-page__code"]]], children: ["404"] },
          { type: "h1", children: ["Cette page s'est égarée en cours de montage"] },
          {
            type: "p",
            children: ["La page que vous cherchez n'existe pas ou a été déplacée."],
          },
          Link({ to: "/", label: "Retour à l'accueil", className: "button button--primary" }),
        ],
      },
    ],
  });
}
