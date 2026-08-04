import Field from "../../components/ui/field.js";
import config, { updateConfig } from "../../config.js";
import portfolioStore, { notify, recordAudit, setContent } from "../../store/portfolio-store.js";
import { fallbackContent } from "../../services/portfolio-service.js";
import { publishContent, refreshContent } from "../../services/bootstrap.js";
import { logout } from "../../services/auth-service.js";

function exportJson(content) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "portfolio.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  file
    .text()
    .then((text) => {
      const parsed = JSON.parse(text);
      const missing = ["profile", "experiences", "projects", "skills"].filter(
        (key) => parsed[key] === undefined,
      );
      if (missing.length > 0) {
        throw new Error(`clés manquantes : ${missing.join(", ")}`);
      }
      setContent({ media: [], ...parsed }, "local");
      recordAudit("Import d'un fichier JSON", file.name);
      notify("Contenus importés depuis le fichier.", "success");
    })
    .catch((error) => notify(`Import impossible : ${error.message}`, "error"))
    .finally(() => {
      event.target.value = "";
    });
}

function Row(label, value) {
  return {
    type: "div",
    attributes: [["class", ["status-row"]]],
    children: [
      { type: "dt", children: [label] },
      { type: "dd", children: [value] },
    ],
  };
}

export default function PublishSection() {
  const source = portfolioStore.get("source");
  const status = portfolioStore.get("status");
  const session = portfolioStore.get("session");
  const dirty = portfolioStore.get("dirty");
  const content = portfolioStore.get("content");

  return {
    type: "section",
    attributes: [["class", ["editor"]], ["aria-labelledby", "editor-publication"]],
    children: [
      { type: "h2", attributes: [["id", "editor-publication"]], children: ["Publication & synchronisation"] },
      {
        type: "dl",
        attributes: [["class", ["status-list"]]],
        children: [
          Row("Source des contenus", source === "cms" ? "Strapi" : "Stockage local"),
          Row("Session", session?.mode === "cms" ? `Strapi (${session.user.username})` : "Mode local"),
          Row("Rôle", session?.role === "reader" ? "Lecteur" : "Administrateur"),
          Row("Modifications non publiées", dirty ? "Oui" : "Non"),
        ],
      },
      Field({
        id: "cms-url",
        label: "URL du CMS Strapi",
        inputType: "url",
        value: config.cmsUrl,
        hint: "Exemple : http://localhost:1337 ou https://cms.mon-domaine.fr",
        onInput: (value) => updateConfig({ cmsUrl: value }),
      }),
      {
        type: "div",
        attributes: [["class", ["button-row"]]],
        children: [
          {
            type: "button",
            attributes: [
              ["type", "button"],
              ["class", ["button", "button--primary"]],
              ["disabled", status === "saving" || session?.role === "reader"],
            ],
            events: [["click", () => publishContent().catch(() => {})]],
            children: [status === "saving" ? "Publication…" : "Publier vers le CMS"],
          },
          {
            type: "button",
            attributes: [
              ["type", "button"],
              ["class", ["button", "button--ghost"]],
              ["disabled", status === "loading"],
            ],
            events: [["click", () => refreshContent()]],
            children: [status === "loading" ? "Chargement…" : "Recharger depuis le CMS"],
          },
          {
            type: "button",
            attributes: [
              ["type", "button"],
              ["class", ["button", "button--ghost"]],
            ],
            events: [
              [
                "click",
                () => {
                  exportJson(content);
                  recordAudit("Export JSON des contenus");
                },
              ],
            ],
            children: ["Exporter en JSON"],
          },
          {
            type: "label",
            attributes: [["class", ["button", "button--ghost"]], ["for", "import-json"]],
            children: [
              "Importer un JSON",
              {
                type: "input",
                attributes: [
                  ["id", "import-json"],
                  ["type", "file"],
                  ["accept", "application/json,.json"],
                  ["class", ["visually-hidden"]],
                ],
                events: [["change", importJson]],
              },
            ],
          },
          {
            type: "button",
            attributes: [
              ["type", "button"],
              ["class", ["button", "button--danger"]],
            ],
            events: [
              [
                "click",
                () => {
                  setContent(fallbackContent(), "local");
                  notify("Contenu local réinitialisé.", "info");
                },
              ],
            ],
            children: ["Réinitialiser le contenu local"],
          },
          {
            type: "button",
            attributes: [
              ["type", "button"],
              ["class", ["button", "button--ghost"]],
            ],
            events: [["click", logout]],
            children: ["Se déconnecter"],
          },
        ],
      },
    ],
  };
}
