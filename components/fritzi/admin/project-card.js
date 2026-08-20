import Link from "../../router/link.js";
import { stateLabel } from "../../../data/workflow.js";

export function ProjectCard(project) {
  return {
    type: "article",
    key: String(project.id),
    attributes: [["class", ["project-card"]]],
    children: [
      project.cover?.url
        ? { type: "img", attributes: [["src", project.cover.url], ["alt", ""], ["loading", "lazy"]] }
        : null,
      {
        type: "div",
        attributes: [["class", ["project-card__body"]]],
        children: [
          { type: "p", attributes: [["class", ["project-card__client"]]], children: [project.client || "—"] },
          { type: "h3", children: [project.label || "Untitled project"] },
          {
            type: "div",
            attributes: [["class", ["project-card__badges"]]],
            children: [
              {
                type: "span",
                attributes: [["class", ["badge", `badge--${project.state}`]]],
                children: [stateLabel(project.state)],
              },
              project.featured
                ? { type: "span", attributes: [["class", ["badge", "badge--featured"]]], children: ["★ Featured"] }
                : null,
            ].filter(Boolean),
          },
          Link({ to: `/fritzi/admin/projets/${project.slug}`, label: "Edit", className: "button" }),
        ],
      },
    ].filter(Boolean),
  };
}
