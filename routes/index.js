import MarketingHomePage from "../pages/marketing-home-page.js";
import AdminRedirect from "../pages/admin-redirect.js";
import LoginPage from "../pages/login-page.js";
import LegalPage from "../pages/legal-page.js";
import NotFoundPage from "../pages/not-found-page.js";
import { HomePage as AbdoulayeHomePage } from "../pages/abdoulaye/home.js";
import { ProjectsPage as AbdoulayeProjectsPage } from "../pages/abdoulaye/projects.js";
import { ContactPage as AbdoulayeContactPage } from "../pages/abdoulaye/contact.js";
import { ProjectDetailPage as AbdoulayeProjectDetailPage } from "../pages/abdoulaye/project-detail.js";
import { HomePage as FritziHomePage } from "../pages/fritzi/home.js";
import { AboutPage as FritziAboutPage } from "../pages/fritzi/about.js";
import { WorkPage as FritziWorkPage } from "../pages/fritzi/work.js";
import { ContactPage as FritziContactPage } from "../pages/fritzi/contact.js";
import { ProjectDetailPage as FritziProjectDetailPage } from "../pages/fritzi/project-detail.js";
import {
  FritziAdminEntryRedirect,
  FritziAdminPageRedirect,
  FritziAdminProjectsRedirect,
} from "../pages/fritzi/admin-redirect.js";
import {
  AbdoulayeAdminEntryRedirect,
  AbdoulayeAdminPageRedirect,
  AbdoulayeAdminProjectsRedirect,
} from "../pages/abdoulaye/admin-redirect.js";
import { HomePage as MathisHomePage } from "../pages/mathis/home.js";
import { ProjectDetailPage as MathisProjectDetailPage } from "../pages/mathis/project-detail.js";
import {
  MathisAdminEntryRedirect,
  MathisAdminProfileRedirect,
  MathisAdminProjectsRedirect,
} from "../pages/mathis/admin-redirect.js";

export const REDIRECTS = {
  "/home": "/",
  "/login": "/connexion",
  "/legal": "/mentions-legales",
};

export default {
  "/": MarketingHomePage,
  "/admin": AdminRedirect,
  "/connexion": LoginPage,
  "/inscription": LoginPage,
  "/mentions-legales": LegalPage,
  "/confidentialite": LegalPage,
  "/cookies": LegalPage,
  "/protection-des-donnees": LegalPage,
  "/abdoulaye": AbdoulayeHomePage,
  "/abdoulaye/projets": AbdoulayeProjectsPage,
  "/abdoulaye/projets/:slug": AbdoulayeProjectDetailPage,
  "/abdoulaye/contact": AbdoulayeContactPage,
  "/abdoulaye/admin": AbdoulayeAdminEntryRedirect,
  "/abdoulaye/admin/projets/nouveau": AbdoulayeAdminProjectsRedirect,
  "/abdoulaye/admin/projets/:slug": AbdoulayeAdminProjectsRedirect,
  "/abdoulaye/admin/pages/:page": AbdoulayeAdminPageRedirect,
  "/mathis": MathisHomePage,
  "/mathis/projets/:slug": MathisProjectDetailPage,
  "/mathis/admin": MathisAdminEntryRedirect,
  "/mathis/admin/projets/:slug": MathisAdminProjectsRedirect,
  "/mathis/admin/pages/profil": MathisAdminProfileRedirect,
  "/fritzi": FritziHomePage,
  "/fritzi/about": FritziAboutPage,
  "/fritzi/work": FritziWorkPage,
  "/fritzi/contact": FritziContactPage,
  "/fritzi/projets/:slug": FritziProjectDetailPage,
  "/fritzi/admin": FritziAdminEntryRedirect,
  "/fritzi/admin/projets/nouveau": FritziAdminProjectsRedirect,
  "/fritzi/admin/projets/:slug": FritziAdminProjectsRedirect,
  "/fritzi/admin/pages/:page": FritziAdminPageRedirect,
  "*": NotFoundPage,
};
