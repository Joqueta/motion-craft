import defineComponent from "../../lib/props.js";
import { formatPeriod, paragraphs } from "../../lib/text.js";

const ExperienceItem = defineComponent(
  "ExperienceItem",
  {
    experience: { type: "object", required: true },
  },
  ({ experience }) => ({
    type: "li",
    attributes: [["class", ["timeline__item"]]],
    children: [
      {
        type: "p",
        attributes: [["class", ["timeline__period"]]],
        children: [formatPeriod(experience.startDate, experience.endDate, experience.current)],
      },
      {
        type: "h3",
        attributes: [["class", ["timeline__role"]]],
        children: [experience.role],
      },
      {
        type: "p",
        attributes: [["class", ["timeline__company"]]],
        children: [
          [experience.company, experience.location].filter(Boolean).join(" · "),
        ],
      },
      ...paragraphs(experience.description).map((block, index) => ({
        type: "p",
        key: String(index),
        attributes: [["class", ["timeline__description"]]],
        children: [block],
      })),
    ],
  }),
);

export default ExperienceItem;
