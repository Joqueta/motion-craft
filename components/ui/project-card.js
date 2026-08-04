import "../../lib/interpolate.js";
import defineComponent from "../../lib/props.js";
import Link from "../router/link.js";
import { formatMonth, truncate } from "../../lib/text.js";

const ProjectCard = defineComponent(
  "ProjectCard",
  {
    project: { type: "object", required: true },
  },
  ({ project }) => ({
    type: "article",
    attributes: [["class", ["card", "project-card"]]],
    children: [
      project.image
        ? {
            type: "img",
            attributes: [
              ["class", ["project-card__image"]],
              ["src", project.image],
              ["alt", project.imageAlt || "Aperçu du projet {{ title }}".interpolate(project)],
              ["loading", "lazy"],
            ],
          }
        : null,
      {
        type: "div",
        attributes: [["class", ["project-card__body"]]],
        children: [
          {
            type: "p",
            attributes: [["class", ["project-card__date"]]],
            children: [formatMonth(project.date)],
          },
          {
            type: "h3",
            attributes: [["class", ["project-card__title"]]],
            children: [
              Link({ to: `/projets/${project.slug}`, label: project.title, className: "project-card__link" }),
            ],
          },
          {
            type: "p",
            attributes: [["class", ["project-card__summary"]]],
            children: [truncate(project.summary, 150)],
          },
          {
            type: "ul",
            attributes: [["class", ["tag-list"]]],
            children: project.tags.map((tag) => ({
              type: "li",
              key: tag,
              attributes: [["class", ["tag"]]],
              children: [tag],
            })),
          },
        ],
      },
    ].filter(Boolean),
  }),
);

export default ProjectCard;
