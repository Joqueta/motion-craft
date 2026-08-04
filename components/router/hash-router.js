import { createRoot } from "../../lib/render.js";
import matchRoute from "./match-route.js";

export default function HashRouter(rootElement, routes, options = {}) {
  const { store = null } = options;
  const render = createRoot(rootElement);

  function refresh() {
    const path = window.location.hash.slice(1) || "/";
    const match = matchRoute(routes, path);
    render(match.page({ path, params: match.params, query: {}, pattern: match.pattern }));
  }

  window.addEventListener("hashchange", refresh);
  if (store) store.subscribe(refresh);

  refresh();
  return refresh;
}

export function HashLink(url, title) {
  return {
    type: "a",
    attributes: [["href", `#${url}`]],
    children: [title],
  };
}
