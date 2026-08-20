import Link from "../../components/router/link.js";
import Notice from "../../components/ui/notice.js";
import { AdminNav } from "../../components/fritzi/admin/admin-nav.js";
import { ProfileCard } from "../../components/fritzi/admin/profile-card.js";
import { ProjectCard } from "../../components/fritzi/admin/project-card.js";
import setMeta from "../../lib/seo.js";
import portfolioStore, { notify } from "../../store/portfolio-store.js";
import { loadFritziProjects, loadFritziPage } from "../../services/fritzi-admin-service.js";

let loadedOnce = false;

function startLoad() {
  portfolioStore.update({ fritziStatus: "loading" });
  Promise.all([loadFritziProjects(), loadFritziPage("profil")])
    .then(([projects, profile]) => {
      loadedOnce = true;
      portfolioStore.update({ fritziContent: { projects }, fritziProfileCard: profile, fritziStatus: "ready" });
    })
    .catch((error) => {
      loadedOnce = true;
      notify(`Unable to load: ${error.message}`, "error");
      portfolioStore.update({ fritziStatus: "ready" });
    });
}

export default function FritziAdminPage(props) {
  setMeta({ title: "fritzi admin — Projects", description: "" });

  const session = portfolioStore.get("session");
  const path = props?.path ?? "/fritzi/admin";

  if (!session) {
    return {
      type: "div",
      attributes: [["class", ["app", "fritzi-admin"]]],
      children: [
        AdminNav(path),
        {
          type: "main",
          attributes: [["class", ["container", "admin-locked"]]],
          children: [
            {
              type: "div",
              attributes: [["class", ["admin-locked__intro"]]],
              children: [
                { type: "h1", children: ["Login required"] },
                { type: "p", children: ["Sign in with a Strapi account to manage fritzi projects."] },
                Link({
                  to: `/connexion?next=${encodeURIComponent(path)}`,
                  label: "Sign in",
                  className: "button button--primary",
                }),
              ],
            },
          ],
        },
      ],
    };
  }

  if (!loadedOnce && portfolioStore.get("fritziStatus") !== "loading") startLoad();

  const status = portfolioStore.get("fritziStatus");
  const projects = portfolioStore.get("fritziContent")?.projects ?? [];
  const profile = portfolioStore.get("fritziProfileCard");
  const notice = portfolioStore.get("notice");

  return {
    type: "div",
    attributes: [["class", ["app", "fritzi-admin"]]],
    children: [
      AdminNav(path),
      notice ? Notice({ message: notice.message, tone: notice.tone }) : null,
      {
        type: "main",
        attributes: [["class", ["container"]]],
        children: [
          { type: "h1", children: ["Projects"] },
          status === "loading" || !profile
            ? { type: "p", children: ["Loading…"] }
            : {
                type: "div",
                attributes: [["class", ["admin-hub"]]],
                children: [
                  ProfileCard(profile),
                  {
                    type: "section",
                    attributes: [["class", ["admin-hub__projects"]], ["aria-labelledby", "projects-heading"]],
                    children: [
                      { type: "h2", attributes: [["id", "projects-heading"]], children: ["All projects"] },
                      Link({
                        to: "/fritzi/admin/projets/nouveau",
                        label: "+ New project",
                        className: "button button--primary",
                      }),
                      {
                        type: "div",
                        attributes: [["class", ["project-grid"]]],
                        children: projects.map(ProjectCard),
                      },
                    ],
                  },
                ],
              },
        ],
      },
    ].filter(Boolean),
  };
}
