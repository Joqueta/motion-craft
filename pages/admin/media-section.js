import Field from "../../components/ui/field.js";
import { uniqueId } from "../../lib/text.js";
import portfolioStore, { editContent, notify, recordAudit } from "../../store/portfolio-store.js";
import { deleteMedia, uploadMedia } from "../../services/portfolio-service.js";

function mediaItems() {
  return portfolioStore.get("content.media") ?? [];
}

function isRemote(id) {
  return typeof id === "number" || /^\d+$/.test(String(id ?? ""));
}

function onFileSelected(event) {
  const input = event.target;
  const file = input.files?.[0];
  if (!file) return;

  const alt = document.getElementById("media-alt")?.value ?? "";
  if (!alt.trim()) {
    notify("Renseignez un texte alternatif avant d'envoyer le fichier.", "warning");
    input.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    notify("Fichier trop volumineux : 10 Mo maximum.", "warning");
    input.value = "";
    return;
  }

  portfolioStore.update({ status: "saving" });

  uploadMedia(file, alt)
    .then((media) => {
      editContent("media", [media, ...mediaItems()]);
      recordAudit("Envoi d'un média", media.name);
      notify("Média envoyé au CMS.", "success");
    })
    .catch((error) => notify(`Envoi impossible : ${error.message}`, "error"))
    .finally(() => {
      portfolioStore.update({ status: "ready" });
      input.value = "";
    });
}

function addByUrl() {
  const url = document.getElementById("media-url")?.value.trim() ?? "";
  const alt = document.getElementById("media-alt")?.value.trim() ?? "";

  if (!url) {
    notify("Indiquez l'URL du média.", "warning");
    return;
  }
  if (!alt) {
    notify("Renseignez un texte alternatif.", "warning");
    return;
  }

  editContent("media", [{ id: uniqueId("media"), name: url.split("/").pop(), url, alt }, ...mediaItems()]);
  recordAudit("Ajout d'un média par URL", url);
  document.getElementById("media-url").value = "";
}

function removeMedia(media) {
  const remaining = mediaItems().filter((item) => item.id !== media.id);

  if (isRemote(media.id)) {
    deleteMedia(media.id)
      .then(() => notify("Média supprimé du CMS.", "success"))
      .catch((error) => notify(`Suppression distante impossible : ${error.message}`, "warning"));
  }

  editContent("media", remaining);
  recordAudit("Suppression d'un média", media.name);
}

function MediaCard(media) {
  return {
    type: "figure",
    key: String(media.id),
    attributes: [["class", ["media-card"]]],
    children: [
      {
        type: "img",
        attributes: [
          ["src", media.url],
          ["alt", media.alt],
          ["loading", "lazy"],
        ],
      },
      {
        type: "figcaption",
        children: [
          { type: "p", attributes: [["class", ["media-card__name"]]], children: [media.name || media.url] },
          { type: "p", attributes: [["class", ["media-card__alt"]]], children: [media.alt] },
        ],
      },
      {
        type: "div",
        attributes: [["class", ["media-card__actions"]]],
        children: [
          {
            type: "button",
            attributes: [["type", "button"], ["class", ["button", "button--ghost"]]],
            events: [
              [
                "click",
                () => {
                  navigator.clipboard?.writeText(media.url);
                  notify("URL copiée dans le presse-papiers.", "info");
                },
              ],
            ],
            children: ["Copier l'URL"],
          },
          {
            type: "button",
            attributes: [
              ["type", "button"],
              ["class", ["icon-button", "icon-button--danger"]],
              ["aria-label", `Supprimer ${media.name || "le média"}`],
            ],
            events: [["click", () => removeMedia(media)]],
            children: ["✕"],
          },
        ],
      },
    ],
  };
}

export default function MediaSection() {
  const media = mediaItems();
  const online = portfolioStore.get("session")?.mode === "cms";

  return {
    type: "section",
    attributes: [["class", ["editor"]], ["aria-labelledby", "editor-medias"]],
    children: [
      { type: "h2", attributes: [["id", "editor-medias"]], children: ["Médiathèque"] },
      {
        type: "p",
        attributes: [["class", ["editor__hint"]]],
        children: [
          online
            ? "Les fichiers sont envoyés dans la médiathèque Strapi. 10 Mo maximum par fichier."
            : "En mode local, ajoutez vos images par URL. L'envoi de fichiers nécessite une session Strapi.",
        ],
      },
      Field({
        id: "media-alt",
        label: "Texte alternatif",
        placeholder: "Capture de la page d'accueil du portfolio",
        value: "",
        required: true,
        hint: "Obligatoire : décrit l'image pour les personnes utilisant un lecteur d'écran.",
        onInput: () => {},
      }),
      online
        ? {
            type: "div",
            attributes: [["class", ["field"]]],
            children: [
              {
                type: "label",
                attributes: [["for", "media-file"], ["class", ["field__label"]]],
                children: ["Fichier à envoyer"],
              },
              {
                type: "input",
                attributes: [
                  ["id", "media-file"],
                  ["type", "file"],
                  ["accept", "image/*"],
                  ["class", ["field__control"]],
                ],
                events: [["change", onFileSelected]],
              },
            ],
          }
        : {
            type: "div",
            attributes: [["class", ["field-row"]]],
            children: [
              Field({
                id: "media-url",
                label: "URL du média",
                inputType: "url",
                value: "",
                onInput: () => {},
              }),
              {
                type: "button",
                attributes: [["type", "button"], ["class", ["button", "button--primary"]]],
                events: [["click", addByUrl]],
                children: ["Ajouter"],
              },
            ],
          },
      media.length > 0
        ? {
            type: "div",
            attributes: [["class", ["media-grid"]]],
            children: media.map(MediaCard),
          }
        : {
            type: "p",
            attributes: [["class", ["empty-state"]]],
            children: ["Aucun média pour le moment."],
          },
    ],
  };
}
