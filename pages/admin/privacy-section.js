import config from "../../config.js";
import { MAX_ENTRIES, RETENTION_DAYS } from "../../lib/audit.js";
import portfolioStore, { clearAudit, notify, recordAudit, setContent } from "../../store/portfolio-store.js";
import { fallbackContent } from "../../services/portfolio-service.js";
import { logout } from "../../services/auth-service.js";

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function eraseEverything() {
  const confirmed = window.confirm(
    "Effacer définitivement toutes les données de ce navigateur : contenus locaux, journal d'audit, consentement et session ? Cette action est irréversible.",
  );
  if (!confirmed) return;

  try {
    window.localStorage.removeItem(config.storageKey);
    window.localStorage.removeItem("portfolio.config");
    window.localStorage.removeItem("portfolio.theme");
    window.sessionStorage.removeItem(config.sessionKey);
  } catch {
    notify("Le navigateur a refusé l'accès au stockage local.", "warning");
  }

  clearAudit();
  setContent(fallbackContent(), "local");
  portfolioStore.update({ consent: null });
  logout();
  notify("Toutes les données locales ont été effacées.", "success");
}

export default function PrivacySection() {
  const audit = portfolioStore.get("audit") ?? [];
  const consent = portfolioStore.get("consent");

  return {
    type: "section",
    attributes: [["class", ["editor"]], ["aria-labelledby", "editor-conformite"]],
    children: [
      { type: "h2", attributes: [["id", "editor-conformite"]], children: ["Conformité & journal d'audit"] },

      { type: "h3", children: ["Journal d'audit"] },
      {
        type: "p",
        attributes: [["class", ["editor__hint"]]],
        children: [
          `Actions horodatées, limitées aux ${MAX_ENTRIES} dernières entrées et conservées ${RETENTION_DAYS} jours. Aucune donnée personnelle au-delà du nom d'utilisateur n'est enregistrée.`,
        ],
      },
      audit.length > 0
        ? {
            type: "table",
            attributes: [["class", ["audit-table"]]],
            children: [
              {
                type: "thead",
                children: [
                  {
                    type: "tr",
                    children: [
                      { type: "th", attributes: [["scope", "col"]], children: ["Date"] },
                      { type: "th", attributes: [["scope", "col"]], children: ["Action"] },
                      { type: "th", attributes: [["scope", "col"]], children: ["Cible"] },
                      { type: "th", attributes: [["scope", "col"]], children: ["Auteur"] },
                    ],
                  },
                ],
              },
              {
                type: "tbody",
                children: audit.slice(0, 25).map((entry, index) => ({
                  type: "tr",
                  key: `${entry.at}-${index}`,
                  children: [
                    { type: "td", children: [formatDate(entry.at)] },
                    { type: "td", children: [entry.action] },
                    { type: "td", children: [entry.target] },
                    { type: "td", children: [entry.author] },
                  ],
                })),
              },
            ],
          }
        : { type: "p", attributes: [["class", ["empty-state"]]], children: ["Aucune action enregistrée."] },

      { type: "h3", children: ["Consentement cookies"] },
      {
        type: "p",
        attributes: [["class", ["editor__hint"]]],
        children: [
          consent === null
            ? "Aucun choix enregistré pour l'instant."
            : consent.analytics
              ? `Mesure d'audience acceptée le ${formatDate(consent.at)}.`
              : `Mesure d'audience refusée le ${formatDate(consent.at)}.`,
        ],
      },

      { type: "h3", children: ["Droit à l'effacement"] },
      {
        type: "p",
        attributes: [["class", ["editor__hint"]]],
        children: [
          "Supprime immédiatement de ce navigateur les contenus locaux, le journal d'audit, le consentement et la session. Les contenus déjà publiés dans le CMS doivent être supprimés depuis Strapi.",
        ],
      },
      {
        type: "div",
        attributes: [["class", ["button-row"]]],
        children: [
          {
            type: "button",
            attributes: [["type", "button"], ["class", ["button", "button--danger"]]],
            events: [["click", eraseEverything]],
            children: ["Effacer toutes mes données locales"],
          },
          {
            type: "button",
            attributes: [["type", "button"], ["class", ["button", "button--ghost"]]],
            events: [
              [
                "click",
                () => {
                  clearAudit();
                  recordAudit("Purge du journal d'audit");
                  notify("Journal d'audit vidé.", "info");
                },
              ],
            ],
            children: ["Vider le journal"],
          },
        ],
      },
    ],
  };
}
