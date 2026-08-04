import defineComponent from "../../lib/props.js";
import Link from "../router/link.js";
import portfolioStore, { recordAudit } from "../../store/portfolio-store.js";

function decide(analytics) {
  portfolioStore.update({ consent: { analytics, at: Date.now() } });
  recordAudit(analytics ? "Consentement cookies accepté" : "Consentement cookies refusé");
}

const CookieBanner = defineComponent("CookieBanner", {}, () => {
  if (portfolioStore.get("consent") !== null) return null;

  return {
    type: "aside",
    attributes: [
      ["class", ["cookie-banner"]],
      ["role", "dialog"],
      ["aria-label", "Gestion des cookies"],
      ["aria-live", "polite"],
    ],
    children: [
      {
        type: "div",
        attributes: [["class", ["cookie-banner__text"]]],
        children: [
          {
            type: "p",
            children: [
              "Ce site n'utilise que le stockage local nécessaire à son fonctionnement. Acceptez-vous en plus une mesure d'audience anonyme ?",
            ],
          },
          Link({ to: "/mentions-legales", label: "Mentions légales et confidentialité", className: "cookie-banner__link" }),
        ],
      },
      {
        type: "div",
        attributes: [["class", ["cookie-banner__actions"]]],
        children: [
          {
            type: "button",
            attributes: [["type", "button"], ["class", ["button", "button--ghost"]]],
            events: [["click", () => decide(false)]],
            children: ["Refuser"],
          },
          {
            type: "button",
            attributes: [["type", "button"], ["class", ["button", "button--accent"]]],
            events: [["click", () => decide(true)]],
            children: ["Accepter"],
          },
        ],
      },
    ],
  };
});

export default CookieBanner;
