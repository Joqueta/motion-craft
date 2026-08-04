import setMeta from "../lib/seo.js";
import { RETENTION_DAYS } from "../lib/audit.js";
import config from "../config.js";
import portfolioStore, { recordAudit, notify } from "../store/portfolio-store.js";
import Link from "../components/router/link.js";
import CookieBanner from "../components/ui/cookie-banner.js";
import ThemeToggle from "../components/ui/theme-toggle.js";

const PAGES = {
  "/mentions-legales": "mentions",
  "/confidentialite": "confidentialite",
  "/cookies": "cookies",
  "/protection-des-donnees": "protection",
};

const NAV = [
  { to: "/mentions-legales", label: "Mentions légales" },
  { to: "/confidentialite", label: "Confidentialité" },
  { to: "/cookies", label: "Cookies" },
  { to: "/protection-des-donnees", label: "Protection des données" },
];

const TITLES = {
  mentions: "Mentions légales",
  confidentialite: "Confidentialité",
  cookies: "Politique de cookies",
  protection: "Protection des données",
};

function Block(title, paragraphs) {
  return {
    type: "section",
    attributes: [["class", ["legal__block"]]],
    children: [
      { type: "h2", children: [title] },
      ...paragraphs.map((text, index) => ({ type: "p", key: String(index), children: [text] })),
    ],
  };
}

function Table(rows) {
  return {
    type: "table",
    attributes: [["class", ["audit-table"]]],
    children: [
      {
        type: "thead",
        children: [
          {
            type: "tr",
            children: [
              { type: "th", children: ["Clé"] },
              { type: "th", children: ["Finalité"] },
              { type: "th", children: ["Durée"] },
            ],
          },
        ],
      },
      {
        type: "tbody",
        children: rows.map((row) => ({
          type: "tr",
          key: row[0],
          children: row.map((cell, index) => ({ type: "td", key: String(index), children: [cell] })),
        })),
      },
    ],
  };
}

function MentionsContent(profile) {
  return [
    Block("Éditeur du site", [
      `Ce portfolio est édité par ${profile.name || "l'auteur du site"} dans le cadre du projet semestriel de l'école Decode.`,
      profile.email ? `Contact : ${profile.email}` : "Contact : voir la page d'accueil.",
    ]),
    Block("Hébergement", [
      "Le site est un ensemble de fichiers statiques. Les contenus éditoriaux sont servis par une instance Strapi auto-hébergée.",
    ]),
  ];
}

function ConfidentialiteContent() {
  return [
    Block("Données collectées", [
      "Aucun compte visiteur n'est créé et aucune donnée personnelle n'est collectée à la simple consultation du site.",
      `L'espace d'administration enregistre un journal des actions d'édition (date, action, nom d'utilisateur), conservé ${RETENTION_DAYS} jours au maximum et consultable depuis le back-office.`,
    ]),
    Block("Vos droits", [
      "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et d'effacement de vos données.",
      "Voir l'onglet « Protection des données » pour exercer ces droits.",
    ]),
  ];
}

function CookiesContent(consent) {
  return [
    Block("Stockage local", [
      "Ce site n'utilise pas de cookie publicitaire. Le stockage local du navigateur conserve les contenus en cours d'édition, la préférence de thème et le choix de consentement.",
      consent === null
        ? "Vous n'avez pas encore exprimé de choix concernant la mesure d'audience."
        : consent.analytics
          ? "Vous avez accepté la mesure d'audience anonyme."
          : "Vous avez refusé la mesure d'audience anonyme.",
    ]),
    {
      type: "section",
      attributes: [["class", ["legal__block"]]],
      children: [
        { type: "h2", children: ["Détail des données stockées"] },
        Table([
          [config.storageKey, "Contenus du portfolio en cours d'édition", "Jusqu'à suppression manuelle"],
          [config.sessionKey, "Session d'administration", "Fermeture de l'onglet"],
          ["portfolio.theme", "Préférence d'affichage (clair / sombre)", "Jusqu'à suppression manuelle"],
        ]),
      ],
    },
    {
      type: "div",
      attributes: [["class", ["button-row"]]],
      children: [
        {
          type: "button",
          attributes: [["type", "button"], ["class", ["button", "button--ghost"]]],
          events: [
            [
              "click",
              () => {
                portfolioStore.update({ consent: null });
                recordAudit("Consentement cookies réinitialisé");
                notify("Votre choix de consentement a été réinitialisé.", "info");
              },
            ],
          ],
          children: ["Revoir mon choix de cookies"],
        },
      ],
    },
  ];
}

function ProtectionContent() {
  return [
    Block("Export et suppression de vos données", [
      "Vous pouvez exporter l'intégralité des contenus de ce portfolio au format JSON depuis l'onglet Publication du back-office.",
      "Le bouton ci-dessous efface immédiatement toutes les données conservées par ce site dans votre navigateur.",
    ]),
    {
      type: "div",
      attributes: [["class", ["button-row"]]],
      children: [
        {
          type: "button",
          attributes: [["type", "button"], ["class", ["button", "button--danger"]]],
          events: [
            [
              "click",
              () => {
                if (!window.confirm("Effacer toutes les données de ce site dans votre navigateur ?")) return;
                window.localStorage.clear();
                window.sessionStorage.clear();
                window.location.reload();
              },
            ],
          ],
          children: ["Effacer mes données"],
        },
      ],
    },
  ];
}

export default function LegalPage({ path = "/mentions-legales" } = {}) {
  const active = PAGES[path] ?? "mentions";
  const profile = portfolioStore.get("content.profile");
  const consent = portfolioStore.get("consent");

  setMeta({
    title: TITLES[active],
    description: "Mentions légales, confidentialité, cookies et protection des données de ce portfolio.",
  });

  const content =
    active === "mentions"
      ? MentionsContent(profile)
      : active === "confidentialite"
        ? ConfidentialiteContent()
        : active === "cookies"
          ? CookiesContent(consent)
          : ProtectionContent();

  return {
    type: "div",
    attributes: [["class", ["app"]]],
    children: [
      {
        type: "a",
        attributes: [["href", "#contenu"], ["class", ["skip-link"]]],
        children: ["Aller au contenu principal"],
      },
      {
        type: "header",
        attributes: [["class", ["legal-nav"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["legal-nav__inner", "container"]]],
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
                attributes: [["class", ["legal-nav__end"]]],
                children: [
                  ThemeToggle(),
                  Link({ to: "/", label: "← Retour à l'accueil", className: "legal-nav__back" }),
                ],
              },
            ],
          },
        ],
      },
      {
        type: "main",
        attributes: [["id", "contenu"], ["class", ["app__main"]], ["tabindex", "-1"]],
        children: [
          {
            type: "div",
            attributes: [["class", ["container", "legal"]]],
            children: [
              {
                type: "nav",
                attributes: [["class", ["legal__tabs"]], ["aria-label", "Pages légales"]],
                children: NAV.map((item) => ({
                  ...Link({
                    to: item.to,
                    label: item.label,
                    className: "legal__tab",
                    active: item.to === path,
                  }),
                  key: item.to,
                })),
              },
              { type: "h1", children: [TITLES[active]] },
              ...content,
            ],
          },
        ],
      },
      {
        type: "footer",
        attributes: [["class", ["marketing-footer"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["marketing-footer__inner", "container"]]],
            children: [
              {
                type: "p",
                attributes: [["class", ["marketing-footer__copy"]]],
                children: [`© ${new Date().getFullYear()} MotionCraft`],
              },
            ],
          },
        ],
      },
      CookieBanner(),
    ],
  };
}
