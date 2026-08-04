import "../lib/interpolate.js";
import setMeta from "../lib/seo.js";
import { initials, paragraphs } from "../lib/text.js";
import { publicProjects } from "../data/workflow.js";
import portfolioStore from "../store/portfolio-store.js";
import Layout from "../components/layout/layout.js";
import Link from "../components/router/link.js";
import ProjectCard from "../components/ui/project-card.js";
import SkillGroup from "../components/ui/skill-group.js";
import ExperienceItem from "../components/ui/experience-item.js";

function groupSkills(skills) {
  const groups = new Map();
  for (const skill of skills) {
    if (!groups.has(skill.category)) groups.set(skill.category, []);
    groups.get(skill.category).push(skill);
  }
  return [...groups.entries()];
}

function Hero(profile) {
  return {
    type: "section",
    attributes: [["class", ["hero"]]],
    children: [
      {
        type: "p",
        attributes: [["class", ["eyebrow"]]],
        children: ["Portfolio · Vanilla-Engine"],
      },
      {
        type: "div",
        attributes: [["class", ["hero__identity"]]],
        children: [
          profile.avatar
            ? {
                type: "img",
                attributes: [
                  ["class", ["hero__avatar"]],
                  ["src", profile.avatar],
                  ["alt", profile.avatarAlt || "Portrait de {{ name }}".interpolate(profile)],
                ],
              }
            : {
                type: "span",
                attributes: [["class", ["hero__avatar", "hero__avatar--initials"]], ["aria-hidden", "true"]],
                children: [initials(profile.name)],
              },
          {
            type: "div",
            children: [
              { type: "h1", attributes: [["class", ["hero__name"]]], children: [profile.name] },
              { type: "p", attributes: [["class", ["hero__title"]]], children: [profile.title] },
              profile.location
                ? {
                    type: "p",
                    attributes: [["class", ["hero__location"]]],
                    children: [profile.location],
                  }
                : null,
            ].filter(Boolean),
          },
        ],
      },
      {
        type: "div",
        attributes: [["class", ["hero__bio"]]],
        children: paragraphs(profile.bio).map((block, index) => ({
          type: "p",
          key: String(index),
          children: [block],
        })),
      },
      {
        type: "div",
        attributes: [["class", ["hero__actions"]]],
        children: [
          Link({ to: "/projets", label: "Voir mes projets", className: "button button--primary" }),
          profile.email
            ? {
                type: "a",
                attributes: [
                  ["href", `mailto:${profile.email}`],
                  ["class", ["button", "button--ghost"]],
                ],
                children: ["Me contacter"],
              }
            : null,
        ].filter(Boolean),
      },
    ],
  };
}

function Section(id, title, subtitle, children) {
  return {
    type: "section",
    attributes: [
      ["class", ["section"]],
      ["id", id],
      ["aria-labelledby", `${id}-titre`],
    ],
    children: [
      {
        type: "div",
        attributes: [["class", ["section__head"]]],
        children: [
          { type: "h2", attributes: [["id", `${id}-titre`]], children: [title] },
          subtitle ? { type: "p", attributes: [["class", ["section__subtitle"]]], children: [subtitle] } : null,
        ].filter(Boolean),
      },
      ...children,
    ],
  };
}

export default function HomePage({ path }) {
  const content = portfolioStore.get("content");
  const { profile, experiences, skills, projects } = content;
  const published = publicProjects(projects);
  const highlighted = published.filter((project) => project.featured);
  const showcase = (highlighted.length > 0 ? highlighted : published).slice(0, 3);

  setMeta({
    title: "{{ name }} — {{ title }}".interpolate(profile),
    description: profile.seoDescription || profile.bio,
    image: profile.avatar,
    type: "profile",
  });

  return Layout({
    path,
    className: "page page--home",
    children: [
      { type: "div", attributes: [["class", ["container"]]], children: [Hero(profile)] },
      {
        type: "div",
        attributes: [["class", ["container"]]],
        children: [
          skills.length > 0
            ? Section("competences", "Compétences", "Ce que je sais faire aujourd'hui", [
                {
                  type: "div",
                  attributes: [["class", ["skill-grid"]]],
                  children: groupSkills(skills).map(([category, items]) => ({
                    ...SkillGroup({ category, skills: items }),
                    key: category,
                  })),
                },
              ])
            : null,

          experiences.length > 0
            ? Section("parcours", "Parcours", "Mes expériences les plus récentes", [
                {
                  type: "ol",
                  attributes: [["class", ["timeline"]]],
                  children: experiences.map((experience) => ({
                    ...ExperienceItem({ experience }),
                    key: String(experience.id),
                  })),
                },
              ])
            : null,

          showcase.length > 0
            ? Section("projets", "Projets", "Une sélection de réalisations", [
                {
                  type: "div",
                  attributes: [["class", ["card-grid"]]],
                  children: showcase.map((project) => ({
                    ...ProjectCard({ project }),
                    key: String(project.id),
                  })),
                },
                {
                  type: "p",
                  attributes: [["class", ["section__more"]]],
                  children: [Link({ to: "/projets", label: "Tous les projets", className: "link-arrow" })],
                },
              ])
            : null,

          profile.email
            ? Section("contact", "Contact", "Disponible pour une alternance ou une mission", [
                {
                  type: "ul",
                  attributes: [["class", ["contact-list"]]],
                  children: [
                    {
                      type: "li",
                      key: "email",
                      children: [
                        {
                          type: "a",
                          attributes: [["href", `mailto:${profile.email}`]],
                          children: [profile.email],
                        },
                      ],
                    },
                    profile.phone
                      ? {
                          type: "li",
                          key: "phone",
                          children: [
                            {
                              type: "a",
                              attributes: [["href", `tel:${profile.phone.replace(/\s+/g, "")}`]],
                              children: [profile.phone],
                            },
                          ],
                        }
                      : null,
                  ].filter(Boolean),
                },
              ])
            : null,
        ].filter(Boolean),
      },
    ],
  });
}
