import { Nav } from "./nav.js";
import { Footer } from "./footer.js";

export function Layout(content, profile = {}) {
  const wrapper = document.createDocumentFragment();

  wrapper.appendChild(Nav());

  const skipTarget = content.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? content.firstElementChild : content;
  if (skipTarget) {
    skipTarget.id = "contenu";
    skipTarget.tabIndex = -1;
  }
  wrapper.appendChild(content);

  wrapper.appendChild(Footer({ name: `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() }));

  const root = document.createElement("div");
  root.className = "page page--mathis";
  root.appendChild(wrapper);

  return root;
}
