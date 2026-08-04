import "./lib/interpolate.js";
import config from "./config.js";
import BrowserRouter from "./components/router/browser-router.js";
import routes, { REDIRECTS } from "./routes/index.js";
import portfolioStore from "./store/portfolio-store.js";
import bootstrap from "./services/bootstrap.js";

const rootElement = document.getElementById("root");

BrowserRouter(rootElement, routes, {
  store: portfolioStore,
  base: config.basePath,
  redirects: REDIRECTS,
});

bootstrap();
