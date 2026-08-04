import setMeta from "../lib/seo.js";
import portfolioStore from "../store/portfolio-store.js";
import Link from "../components/router/link.js";
import { navigate } from "../components/router/browser-router.js";
import ThemeToggle from "../components/ui/theme-toggle.js";
import CookieBanner from "../components/ui/cookie-banner.js";
import MarketingFooter from "../components/layout/marketing-footer.js";
import PortfolioPreview from "../components/ui/portfolio-preview.js";
import { logout } from "../services/auth-service.js";
import ProfileSection from "./admin/profile-section.js";
import SkillsSection from "./admin/skills-section.js";
import ExperiencesSection from "./admin/experiences-section.js";
import ProjectsSection from "./admin/projects-section.js";
import MediaSection from "./admin/media-section.js";
import PublishSection from "./admin/publish-section.js";
import PrivacySection from "./admin/privacy-section.js";

const SECTIONS = [
  { id: "profil", label: "Profil", render: ProfileSection },
  { id: "competences", label: "Compétences", render: SkillsSection },
  { id: "experiences", label: "Expériences", render: ExperiencesSection },
  { id: "projets", label: "Projets", render: ProjectsSection },
  { id: "medias", label: "Médiathèque", render: MediaSection },
  { id: "publication", label: "Publication", render: PublishSection },
  { id: "conformite", label: "Conformité", render: PrivacySection },
];

export default function AdminPage({ query }) {
  const active = SECTIONS.find((section) => section.id === query.section) ?? SECTIONS[0];
  const content = portfolioStore.get("content");

  setMeta({ title: "Back-office — démo MotionCraft", description: "" });

  return {
    type: "div",
    attributes: [["class", ["app"]]],
    children: [
      {
        type: "a",
        attributes: [["href", "#contenu"], ["class", ["skip-link"]]],
        children: ["Aller au contenu principal"],
      },
      {
        type: "header",
        attributes: [["class", ["marketing-nav"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["marketing-nav__inner", "container"]]],
            children: [
              Link({
                to: "/",
                className: "brand",
                children: [
                  {
                    type: "img",
                    attributes: [
                      ["class", ["marketing-nav__mark"]],
                      ["src", "/assets/motioncraft-mark.svg"],
                      ["alt", ""],
                      ["aria-hidden", "true"],
                    ],
                  },
                  { type: "span", children: ["MotionCraft"] },
                ],
              }),
              {
                type: "div",
                attributes: [["class", ["marketing-nav__actions"]]],
                children: [
                  ThemeToggle(),
                  {
                    type: "button",
                    attributes: [["type", "button"], ["class", ["button", "button--ghost"]]],
                    events: [
                      [
                        "click",
                        () => {
                          logout();
                          navigate("/");
                        },
                      ],
                    ],
                    children: ["Déconnexion"],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "main",
        attributes: [["id", "contenu"], ["class", ["app__main"]], ["tabindex", "-1"]],
        children: [
          {
            type: "div",
            attributes: [["class", ["container", "admin"]]],
            children: [
              {
                type: "nav",
                attributes: [
                  ["class", ["admin__nav"]],
                  ["aria-label", "Sections du back-office"],
                ],
                children: SECTIONS.map((section) => ({
                  ...Link({
                    to: `/admin?section=${section.id}`,
                    label: section.label,
                    className: "admin__tab",
                    active: section.id === active.id,
                  }),
                  key: section.id,
                })),
              },
              {
                type: "div",
                attributes: [["class", ["admin__editor"]]],
                children: [active.render()],
              },
              {
                type: "aside",
                attributes: [["class", ["admin__preview"]]],
                children: [
                  { type: "h2", attributes: [["class", ["admin__preview-title"]]], children: ["Aperçu en direct"] },
                  PortfolioPreview({ content }),
                ],
              },
            ],
          },
        ],
      },
      MarketingFooter(),
      CookieBanner(),
    ],
  };
}
