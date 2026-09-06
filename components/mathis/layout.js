import { Nav } from "./nav.js";
import { Footer } from "./footer.js";

export function Layout(content, profile = {}) {
  const wrapper = document.createDocumentFragment();

  wrapper.appendChild(Nav());

  const main = document.createElement("main");
  main.appendChild(content);

  const skipTarget = main.firstElementChild;
  if (skipTarget) {
    skipTarget.id = "contenu";
    skipTarget.tabIndex = -1;
  }
  wrapper.appendChild(main);

  wrapper.appendChild(Footer({ name: `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() }));

  const root = document.createElement("div");
  root.className = "page page--mathis";
  root.appendChild(wrapper);

  return root;
}
