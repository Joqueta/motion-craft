import defineComponent from "../../lib/props.js";
import { formatPeriod, initials, paragraphs, truncate } from "../../lib/text.js";
import { publicProjects } from "../../data/workflow.js";

const PortfolioPreview = defineComponent(
  "PortfolioPreview",
  {
    content: { type: "object", required: true },
  },
  ({ content }) => {
    const { profile, skills, experiences, projects } = content;
    const published = publicProjects(projects);

    return {
      type: "div",
      attributes: [
        ["class", ["preview"]],
        ["aria-label", "Aperçu du portfolio"],
      ],
      children: [
        {
          type: "div",
          attributes: [["class", ["preview__hero"]]],
          children: [
            {
              type: "span",
              attributes: [["class", ["preview__avatar"]], ["aria-hidden", "true"]],
              children: [initials(profile.name)],
            },
            {
              type: "div",
              children: [
                { type: "p", attributes: [["class", ["preview__name"]]], children: [profile.name || "Votre nom"] },
                { type: "p", attributes: [["class", ["preview__title"]]], children: [profile.title || "Votre titre"] },
              ],
            },
          ],
        },
        {
          type: "p",
          attributes: [["class", ["preview__bio"]]],
          children: [truncate(paragraphs(profile.bio)[0] ?? "", 180)],
        },
        {
          type: "p",
          attributes: [["class", ["preview__label"]]],
          children: [`Compétences (${skills.length})`],
        },
        {
          type: "ul",
          attributes: [["class", ["preview__tags"]]],
          children: skills.slice(0, 8).map((skill) => ({
            type: "li",
            key: String(skill.id),
            children: [skill.name || "—"],
          })),
        },
        {
          type: "p",
          attributes: [["class", ["preview__label"]]],
          children: [`Expériences (${experiences.length})`],
        },
        {
          type: "ul",
          attributes: [["class", ["preview__lines"]]],
          children: experiences.slice(0, 3).map((experience) => ({
            type: "li",
            key: String(experience.id),
            children: [
              `${experience.role || "—"} · ${formatPeriod(experience.startDate, experience.endDate, experience.current)}`,
            ],
          })),
        },
        {
          type: "p",
          attributes: [["class", ["preview__label"]]],
          children: [`Projets publiés (${published.length})`],
        },
        {
          type: "ul",
          attributes: [["class", ["preview__lines"]]],
          children: published.slice(0, 4).map((project) => ({
            type: "li",
            key: String(project.id),
            children: [project.title || "—"],
          })),
        },
      ],
    };
  },
);

export default PortfolioPreview;
