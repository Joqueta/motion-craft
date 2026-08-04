import defineComponent from "../../lib/props.js";

const LEVEL_LABELS = ["Découverte", "Notions", "Autonome", "Confirmé", "Expert"];

const SkillGroup = defineComponent(
  "SkillGroup",
  {
    category: { type: "string", required: true },
    skills: { type: "array", required: true },
  },
  ({ category, skills }) => ({
    type: "section",
    attributes: [["class", ["skill-group"]]],
    children: [
      {
        type: "h3",
        attributes: [["class", ["skill-group__title"]]],
        children: [category],
      },
      {
        type: "ul",
        attributes: [["class", ["skill-group__list"]]],
        children: skills.map((skill) => ({
          type: "li",
          key: String(skill.id),
          attributes: [["class", ["skill"]]],
          children: [
            {
              type: "span",
              attributes: [["class", ["skill__name"]]],
              children: [skill.name],
            },
            {
              type: "span",
              attributes: [
                ["class", ["skill__meter"]],
                ["role", "img"],
                ["aria-label", `${LEVEL_LABELS[skill.level - 1] ?? "Autonome"} (${skill.level} sur 5)`],
              ],
              children: Array.from({ length: 5 }, (_, index) => ({
                type: "span",
                key: String(index),
                attributes: [["class", ["skill__dot", index < skill.level ? "is-filled" : ""]]],
              })),
            },
          ],
        })),
      },
    ],
  }),
);

export default SkillGroup;
