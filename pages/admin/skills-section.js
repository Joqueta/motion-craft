import Field from "../../components/ui/field.js";
import Notice from "../../components/ui/notice.js";
import portfolioStore from "../../store/portfolio-store.js";
import { SKILL_CATEGORIES } from "../../data/seed.js";
import { createEmptySkill } from "../../services/portfolio-service.js";
import { AddButton, ItemToolbar, addItem, bindField, items } from "./collection.js";

const LEVELS = [
  { value: 1, label: "1 — Découverte" },
  { value: 2, label: "2 — Notions" },
  { value: 3, label: "3 — Autonome" },
  { value: 4, label: "4 — Confirmé" },
  { value: 5, label: "5 — Expert" },
];

export default function SkillsSection() {
  const skills = items("skills");
  const readOnly = portfolioStore.get("session")?.role === "reader";

  return {
    type: "section",
    attributes: [["class", ["editor"]], ["aria-labelledby", "editor-competences"]],
    children: [
      { type: "h2", attributes: [["id", "editor-competences"]], children: ["Compétences"] },
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
        children: ["Les compétences sont regroupées par catégorie sur la page d'accueil."],
      },
      {
        type: "div",
        attributes: [["class", ["editor-list"]]],
        children: skills.map((skill, index) => ({
          type: "div",
          key: String(skill.id),
          attributes: [["class", ["editor-item", "editor-item--row"]]],
          children: [
            Field({
              id: `skill-name-${index}`,
              label: "Compétence",
              value: skill.name,
              placeholder: "JavaScript",
              disabled: readOnly,
              onInput: bindField("skills", index, "name"),
            }),
            Field({
              id: `skill-category-${index}`,
              label: "Catégorie",
              control: "select",
              value: skill.category,
              options: SKILL_CATEGORIES.map((category) => ({ value: category, label: category })),
              disabled: readOnly,
              onInput: bindField("skills", index, "category"),
            }),
            Field({
              id: `skill-level-${index}`,
              label: "Niveau",
              control: "select",
              value: skill.level,
              options: LEVELS,
              disabled: readOnly,
              onInput: (value) => bindField("skills", index, "level")(Number(value)),
            }),
            ItemToolbar("skills", index, skills.length, "la compétence", readOnly),
          ],
        })),
      },
      AddButton("Ajouter une compétence", () => addItem("skills", createEmptySkill), readOnly),
    ].filter(Boolean),
  };
}
