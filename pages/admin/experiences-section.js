import Field from "../../components/ui/field.js";
import { createEmptyExperience } from "../../services/portfolio-service.js";
import { AddButton, ItemToolbar, addItem, bindField, items } from "./collection.js";

export default function ExperiencesSection() {
  const experiences = items("experiences");

  return {
    type: "section",
    attributes: [["class", ["editor"]], ["aria-labelledby", "editor-experiences"]],
    children: [
      { type: "h2", attributes: [["id", "editor-experiences"]], children: ["Expériences"] },
      {
        type: "div",
        attributes: [["class", ["editor-list"]]],
        children: experiences.map((experience, index) => ({
          type: "div",
          key: String(experience.id),
          attributes: [["class", ["editor-item"]]],
          children: [
            {
              type: "div",
              attributes: [["class", ["editor-item__head"]]],
              children: [
                {
                  type: "h3",
                  children: [experience.role || "Nouvelle expérience"],
                },
                ItemToolbar("experiences", index, experiences.length, "l'expérience"),
              ],
            },
            {
              type: "div",
              attributes: [["class", ["editor-grid"]]],
              children: [
                Field({
                  id: `experience-role-${index}`,
                  label: "Poste",
                  value: experience.role,
                  required: true,
                  onInput: bindField("experiences", index, "role"),
                }),
                Field({
                  id: `experience-company-${index}`,
                  label: "Entreprise",
                  value: experience.company,
                  onInput: bindField("experiences", index, "company"),
                }),
                Field({
                  id: `experience-location-${index}`,
                  label: "Lieu",
                  value: experience.location,
                  onInput: bindField("experiences", index, "location"),
                }),
                Field({
                  id: `experience-start-${index}`,
                  label: "Début",
                  inputType: "month",
                  value: experience.startDate,
                  onInput: bindField("experiences", index, "startDate"),
                }),
                Field({
                  id: `experience-end-${index}`,
                  label: "Fin",
                  inputType: "month",
                  value: experience.endDate,
                  hint: experience.current ? "Ignoré tant que le poste est en cours." : "",
                  onInput: bindField("experiences", index, "endDate"),
                }),
                Field({
                  id: `experience-current-${index}`,
                  label: "Poste en cours",
                  control: "checkbox",
                  value: experience.current,
                  onInput: bindField("experiences", index, "current"),
                }),
              ],
            },
            Field({
              id: `experience-description-${index}`,
              label: "Missions",
              control: "textarea",
              rows: 4,
              value: experience.description,
              onInput: bindField("experiences", index, "description"),
            }),
          ],
        })),
      },
      AddButton("Ajouter une expérience", () => addItem("experiences", createEmptyExperience)),
    ],
  };
}
