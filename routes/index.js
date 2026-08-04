import MarketingHomePage from "../pages/marketing-home-page.js";
import AdminPage from "../pages/admin-page.js";
import LoginPage from "../pages/login-page.js";
import LegalPage from "../pages/legal-page.js";
import NotFoundPage from "../pages/not-found-page.js";

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
  "*": NotFoundPage,
};
