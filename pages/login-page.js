import setMeta from "../lib/seo.js";
import Link from "../components/router/link.js";
import { navigate } from "../components/router/browser-router.js";
import Notice from "../components/ui/notice.js";
import CookieBanner from "../components/ui/cookie-banner.js";
import ThemeToggle from "../components/ui/theme-toggle.js";
import portfolioStore, { notify } from "../store/portfolio-store.js";
import { login, register } from "../services/auth-service.js";
import { refreshContent } from "../services/bootstrap.js";

const USER_ADMIN_ROUTES = {
  fritzi: "/fritzi/admin",
};

function adminRouteForUser(username) {
  return USER_ADMIN_ROUTES[(username ?? "").toLowerCase()] ?? "/admin";
}

const COPY = {
  login: {
    title: "Bon retour",
    subtitle: "Connectez-vous avec votre compte Strapi pour éditer et publier vos contenus.",
    cta: "Se connecter",
  },
  signup: {
    title: "Créer un compte",
    subtitle: "Créez votre accès pour gérer votre portfolio MotionCraft.",
    cta: "Créer mon compte",
    switchPrompt: "Déjà un compte ?",
    switchLabel: "Connectez-vous",
  },
};

function onSubmit(mode, query) {
  return (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (mode === "signup") {
      const fullname = form.elements.fullname.value.trim();
      const email = form.elements.identifier.value.trim();
      const password = form.elements.password.value;

      if (!fullname || !email || !password) {
        notify("Renseignez votre nom, votre email et un mot de passe.", "warning");
        return;
      }

      if (!form.elements.consent.checked) {
        notify("Vous devez accepter le traitement de vos données personnelles.", "warning");
        return;
      }

      portfolioStore.update({ auth: "pending" });

      register(fullname, email, password)
        .then((session) => {
          notify("Compte créé avec succès.", "success");
          navigate(query.next || adminRouteForUser(session.user.username));
          return refreshContent({ silent: true });
        })
        .catch((error) => notify(`Inscription impossible : ${error.message}`, "error"))
        .finally(() => portfolioStore.update({ auth: "idle" }));
      return;
    }

    const identifier = form.elements.identifier.value.trim();
    const password = form.elements.password.value;

    if (!identifier || !password) {
      notify("Renseignez votre identifiant et votre mot de passe.", "warning");
      return;
    }

    portfolioStore.update({ auth: "pending" });

    login(identifier, password)
      .then((session) => {
        notify("Connexion réussie.", "success");
        navigate(query.next || adminRouteForUser(session.user.username));
        return refreshContent({ silent: true });
      })
      .catch((error) => notify(`Connexion refusée : ${error.message}`, "error"))
      .finally(() => portfolioStore.update({ auth: "idle" }));
  };
}

function TextField(id, label, type, autocomplete, placeholder) {
  return {
    type: "div",
    attributes: [["class", ["field"]]],
    children: [
      {
        type: "label",
        attributes: [["for", id], ["class", ["field__label"]]],
        children: [label],
      },
      {
        type: "input",
        attributes: [
          ["id", id],
          ["name", id],
          ["type", type],
          ["class", ["field__control"]],
          ["autocomplete", autocomplete],
          ["placeholder", placeholder],
          ["required", true],
        ],
      },
    ],
  };
}

function Tabs(mode) {
  return {
    type: "div",
    attributes: [["class", ["auth__tabs"]], ["role", "tablist"]],
    children: [
      {
        type: "button",
        attributes: [
          ["type", "button"],
          ["class", ["auth__tab", mode === "login" ? "is-active" : ""]],
          ["role", "tab"],
          ["aria-selected", String(mode === "login")],
        ],
        events: [["click", () => navigate("/connexion")]],
        children: ["Connexion"],
      },
      {
        type: "button",
        attributes: [
          ["type", "button"],
          ["class", ["auth__tab", mode === "signup" ? "is-active" : ""]],
          ["role", "tab"],
          ["aria-selected", String(mode === "signup")],
        ],
        events: [["click", () => navigate("/inscription")]],
        children: ["Inscription"],
      },
    ],
  };
}

function Showcase() {
  return {
    type: "aside",
    attributes: [["class", ["auth__aside"]], ["aria-hidden", "true"]],
    children: [
      {
        type: "div",
        attributes: [["class", ["auth__card"]]],
        children: [
          { type: "div", attributes: [["class", ["auth__thumb"]]], children: ["▶"] },
          { type: "h3", children: ["Projet — Aurora"] },
          {
            type: "p",
            children: ["Démonstration animée intégrée directement à votre fiche projet."],
          },
        ],
      },
      {
        type: "p",
        attributes: [["class", ["auth__tagline"]]],
        children: [
          "Rejoignez les créateurs qui montrent leur travail — pas seulement qui le décrivent.",
        ],
      },
    ],
  };
}

export default function LoginPage({ path = "/connexion", query = {} } = {}) {
  const mode = path === "/inscription" ? "signup" : "login";
  const pending = portfolioStore.get("auth") === "pending";
  const notice = portfolioStore.get("notice");
  const copy = COPY[mode];

  setMeta({
    title: mode === "signup" ? "Créer un compte" : "Connexion au back-office",
    description: "",
  });

  return {
    type: "div",
    attributes: [["class", ["app"]]],
    children: [
      {
        type: "a",
        attributes: [["href", "#auth-form"], ["class", ["skip-link"]]],
        children: ["Aller au contenu principal"],
      },
      notice ? Notice({ message: notice.message, tone: notice.tone }) : null,
      {
        type: "div",
        attributes: [["class", ["auth"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["auth__panel"]]],
            children: [
              {
                type: "div",
                attributes: [["class", ["auth__brand-row"]]],
                children: [
                  Link({
                    to: "/",
                    className: "brand auth__brand",
                    children: [
                      {
                        type: "img",
                        attributes: [
                          ["class", ["auth__brand-mark"]],
                          ["src", "/assets/motioncraft-mark.svg"],
                          ["alt", ""],
                          ["aria-hidden", "true"],
                        ],
                      },
                      { type: "span", children: ["MotionCraft"] },
                    ],
                  }),
                  ThemeToggle(),
                ],
              },
              {
                type: "form",
                attributes: [["id", "auth-form"], ["class", ["auth__form"]]],
                events: [["submit", onSubmit(mode, query)]],
                children: [
                  Tabs(mode),
                  { type: "h1", attributes: [["class", ["auth__title"]]], children: [copy.title] },
                  { type: "p", attributes: [["class", ["auth__subtitle"]]], children: [copy.subtitle] },

                  mode === "signup"
                    ? TextField("fullname", "Nom complet", "text", "name", "Camille Duret")
                    : null,
                  TextField("identifier", "Email", "text", "username", "camille@email.com"),
                  TextField("password", "Mot de passe", "password", "current-password", "••••••••••"),

                  mode === "signup"
                    ? {
                        type: "div",
                        attributes: [["class", ["auth__consent"]]],
                        children: [
                          {
                            type: "input",
                            attributes: [
                              ["id", "consent"],
                              ["name", "consent"],
                              ["type", "checkbox"],
                              ["class", ["field__checkbox"]],
                            ],
                          },
                          {
                            type: "label",
                            attributes: [["for", "consent"]],
                            children: [
                              "J'accepte que mes données personnelles soient traitées conformément à la ",
                              Link({
                                to: "/mentions-legales",
                                label: "politique de protection des données personnelles",
                              }),
                              ".",
                            ],
                          },
                        ],
                      }
                    : null,

                  mode === "login"
                    ? {
                        type: "div",
                        attributes: [["class", ["auth__forgot"]]],
                        children: [
                          Link({
                            to: "/mot-de-passe-oublie",
                            label: "Mot de passe oublié ?",
                            className: "auth__forgot-link",
                          }),
                        ],
                      }
                    : null,

                  {
                    type: "button",
                    attributes: [
                      ["type", "submit"],
                      ["class", ["button", "button--primary"]],
                      ["disabled", pending],
                    ],
                    children: [pending ? (mode === "signup" ? "Création…" : "Connexion…") : copy.cta],
                  },

                  mode === "signup"
                    ? {
                        type: "p",
                        attributes: [["class", ["auth__switch"]]],
                        children: [
                          `${copy.switchPrompt} `,
                          {
                            type: "button",
                            attributes: [["type", "button"], ["class", ["auth__switch-link"]]],
                            events: [["click", () => navigate("/connexion")]],
                            children: [copy.switchLabel],
                          },
                        ],
                      }
                    : null,
                ].filter(Boolean),
              },
              {
                type: "p",
                attributes: [["class", ["auth__copyright"]]],
                children: [`© ${new Date().getFullYear()} MotionCraft`],
              },
            ],
          },
          Showcase(),
        ],
      },
      CookieBanner(),
    ].filter(Boolean),
  };
}
