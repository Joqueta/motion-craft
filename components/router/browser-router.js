import { createRoot } from "../../lib/render.js";
import matchRoute from "./match-route.js";

let basePath = "";

export function setBasePath(value) {
  basePath = String(value).replace(/\/+$/, "");
}

export function toInternalPath(pathname) {
  if (basePath && pathname.startsWith(basePath)) return pathname.slice(basePath.length) || "/";
  return pathname;
}

export function currentLocation() {
  return {
    path: toInternalPath(window.location.pathname),
    query: Object.fromEntries(new URLSearchParams(window.location.search)),
  };
}

export function navigate(url, { replace = false } = {}) {
  const target = basePath + url;
  if (target === window.location.pathname + window.location.search) return;
  if (replace) window.history.replaceState({}, "", target);
  else window.history.pushState({}, "", target);
  window.dispatchEvent(new Event("pushstate"));
}

let routerMounted = false;

export function isRouterActive() {
  return routerMounted;
}

export default function BrowserRouter(rootElement, routes, options = {}) {
  routerMounted = true;
  const { store = null, base = "", redirects = {} } = options;
  const render = createRoot(rootElement);
  let previousPath = null;
  let renderToken = 0;

  if (base) setBasePath(base);

  rootElement.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[data-route]");
    if (!anchor) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigate(anchor.getAttribute("href"));
  });

  function refresh() {
    const location = currentLocation();

    if (redirects[location.path]) {
      navigate(redirects[location.path], { replace: true });
      return;
    }

    const match = matchRoute(routes, location.path);
    const result = match.page({
      path: location.path,
      params: match.params,
      query: location.query,
      pattern: match.pattern,
    });

    const token = ++renderToken;
    if (result instanceof Promise) {
      result.then((node) => {
        if (token !== renderToken) return;
        render(null);
        rootElement.replaceChildren(node);
      });
    } else {
      render(result);
    }

    if (previousPath !== null && previousPath !== location.path) window.scrollTo({ top: 0 });
    previousPath = location.path;
  }

  window.addEventListener("popstate", refresh);
  window.addEventListener("pushstate", refresh);
  if (store) store.subscribe(refresh);

  refresh();
  return refresh;
}
