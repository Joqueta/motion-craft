import MarketingHomePage from "../pages/marketing-home-page.js";
import AdminPage from "../pages/admin-page.js";
import LoginPage from "../pages/login-page.js";
import LegalPage from "../pages/legal-page.js";
import NotFoundPage from "../pages/not-found-page.js";
import { HomePage as FritziHomePage } from "../pages/fritzi/home.js";
import { AboutPage as FritziAboutPage } from "../pages/fritzi/about.js";
import { WorkPage as FritziWorkPage } from "../pages/fritzi/work.js";
import { ContactPage as FritziContactPage } from "../pages/fritzi/contact.js";
import { ProjectDetailPage as FritziProjectDetailPage } from "../pages/fritzi/project-detail.js";
import FritziAdminPage from "../pages/fritzi/admin.js";
import FritziProjectFormPage from "../pages/fritzi/admin/project-form.js";
import FritziPageFormPage from "../pages/fritzi/admin/page-form.js";

export const REDIRECTS = {
  "/home": "/",
  "/login": "/connexion",
  "/legal": "/mentions-legales",
};

export default {
  "/": MarketingHomePage,
  "/admin": AdminPage,
  "/connexion": LoginPage,
  "/inscription": LoginPage,
  "/mentions-legales": LegalPage,
  "/confidentialite": LegalPage,
  "/cookies": LegalPage,
  "/protection-des-donnees": LegalPage,
  "/fritzi": FritziHomePage,
  "/fritzi/about": FritziAboutPage,
  "/fritzi/work": FritziWorkPage,
  "/fritzi/contact": FritziContactPage,
  "/fritzi/projets/:slug": FritziProjectDetailPage,
  "/fritzi/admin": FritziAdminPage,
  "/fritzi/admin/projets/nouveau": FritziProjectFormPage,
  "/fritzi/admin/projets/:slug": FritziProjectFormPage,
  "/fritzi/admin/pages/:page": FritziPageFormPage,
  "*": NotFoundPage,
};
