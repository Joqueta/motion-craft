import Link from "../../components/router/link.js";
import Notice from "../../components/ui/notice.js";
import { navigate } from "../../components/router/browser-router.js";
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
    // Deferred: navigating synchronously during render re-enters the router
    // (pushstate -> refresh) before this render call returns, and the outer
    // refresh's render(result) call would then overwrite the login page.
    setTimeout(() => navigate(`/connexion?next=${encodeURIComponent(path)}`, { replace: true }), 0);
    return null;
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
