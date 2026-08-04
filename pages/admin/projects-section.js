import Field from "../../components/ui/field.js";
import Notice from "../../components/ui/notice.js";
import { slugify } from "../../lib/text.js";
import { STATES, stateLabel } from "../../data/workflow.js";
import portfolioStore, { editContent, recordAudit } from "../../store/portfolio-store.js";
import { createEmptyProject } from "../../services/portfolio-service.js";
import { AddButton, ItemToolbar, addItem, bindField, items } from "./collection.js";

const STATE_OPTIONS = STATES.map((state) => ({ value: state.value, label: state.label }));

export default function ProjectsSection() {
  const projects = items("projects");
  const readOnly = portfolioStore.get("session")?.role === "reader";

  return {
    type: "section",
    attributes: [["class", ["editor"]], ["aria-labelledby", "editor-projets"]],
    children: [
      { type: "h2", attributes: [["id", "editor-projets"]], children: ["Projets"] },
      readOnly
        ? Notice({
            message: "Rôle lecteur : ces champs sont affichés en lecture seule et ne peuvent pas être modifiés.",
            tone: "info",
            dismissible: false,
          })
        : null,
      {
        type: "p",
        attributes: [["class", ["editor__hint"]]],
        children: ["Seuls les projets publiés apparaissent sur le site public."],
      },
      {
        type: "div",
        attributes: [["class", ["editor-list"]]],
        children: projects.map((project, index) => ({
          type: "div",
          key: String(project.id),
          attributes: [["class", ["editor-item"]]],
          children: [
            {
              type: "div",
              attributes: [["class", ["editor-item__head"]]],
              children: [
                { type: "h3", children: [project.title || "Nouveau projet"] },
                {
                  type: "span",
                  attributes: [["class", ["badge", `badge--${project.state}`]]],
                  children: [stateLabel(project.state)],
                },
                ItemToolbar("projects", index, projects.length, "le projet", readOnly),
              ],
            },
            {
              type: "div",
              attributes: [["class", ["editor-grid"]]],
              children: [
                Field({
                  id: `project-title-${index}`,
                  label: "Titre",
                  value: project.title,
                  required: true,
                  disabled: readOnly,
                  onInput: (value) => {
                    editContent(`projects.${index}.title`, value);
                    if (!project.slug || project.slug === slugify(project.title)) {
                      editContent(`projects.${index}.slug`, slugify(value));
                    }
                  },
                }),
                Field({
                  id: `project-slug-${index}`,
                  label: "Slug",
                  value: project.slug,
                  hint: "Identifiant unique du projet dans le contenu du portfolio.",
                  disabled: readOnly,
                  onInput: (value) => editContent(`projects.${index}.slug`, slugify(value)),
                }),
                Field({
                  id: `project-date-${index}`,
                  label: "Date",
                  inputType: "month",
                  value: project.date,
                  disabled: readOnly,
                  onInput: bindField("projects", index, "date"),
                }),
                Field({
                  id: `project-state-${index}`,
                  label: "État éditorial",
                  control: "select",
                  value: project.state,
                  options: STATE_OPTIONS,
                  hint: "Seul l'état « Publié » est visible sur le site public.",
                  disabled: readOnly,
                  onInput: (value) => {
                    editContent(`projects.${index}.state`, value);
                    recordAudit(`Passage à l'état « ${stateLabel(value)} »`, project.title || project.slug);
                  },
                }),
                Field({
                  id: `project-url-${index}`,
                  label: "Site en ligne",
                  inputType: "url",
                  value: project.url,
                  disabled: readOnly,
                  onInput: bindField("projects", index, "url"),
                }),
                Field({
                  id: `project-repository-${index}`,
                  label: "Dépôt de code",
                  inputType: "url",
                  value: project.repository,
                  disabled: readOnly,
                  onInput: bindField("projects", index, "repository"),
                }),
                Field({
                  id: `project-image-${index}`,
                  label: "Image (URL)",
                  inputType: "url",
                  value: project.image,
                  hint: "Choisissez un fichier dans l'onglet Médiathèque ou collez une URL.",
                  disabled: readOnly,
                  onInput: bindField("projects", index, "image"),
                }),
                Field({
                  id: `project-image-alt-${index}`,
                  label: "Texte alternatif de l'image",
                  value: project.imageAlt,
                  hint: "Décrit l'image pour les lecteurs d'écran.",
                  disabled: readOnly,
                  onInput: bindField("projects", index, "imageAlt"),
                }),
                Field({
                  id: `project-featured-${index}`,
                  label: "Mettre en avant",
                  control: "checkbox",
                  value: project.featured,
                  disabled: readOnly,
                  onInput: bindField("projects", index, "featured"),
                }),
              ],
            },
            Field({
              id: `project-tags-${index}`,
              label: "Technologies",
              value: project.tags.join(", "),
              hint: "Séparées par des virgules.",
              disabled: readOnly,
              onInput: (value) =>
                editContent(
                  `projects.${index}.tags`,
                  value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                ),
            }),
            Field({
              id: `project-summary-${index}`,
              label: "Résumé",
              control: "textarea",
              rows: 2,
              value: project.summary,
              disabled: readOnly,
              onInput: bindField("projects", index, "summary"),
            }),
            Field({
              id: `project-description-${index}`,
              label: "Description détaillée",
              control: "textarea",
              rows: 6,
              value: project.description,
              disabled: readOnly,
              onInput: bindField("projects", index, "description"),
            }),
          ],
        })),
      },
      AddButton("Ajouter un projet", () => addItem("projects", createEmptyProject), readOnly),
    ].filter(Boolean),
  };
}
