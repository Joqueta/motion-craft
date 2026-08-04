function setMetaTag(selector, attribute, name, content) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

export default function setMeta({ title, description = "", image = "", type = "website" } = {}) {
  const url = window.location.href;

  if (title) document.title = title;
  setMetaTag('meta[name="description"]', "name", "description", description);
  setMetaTag('meta[property="og:title"]', "property", "og:title", title ?? document.title);
  setMetaTag('meta[property="og:description"]', "property", "og:description", description);
  setMetaTag('meta[property="og:type"]', "property", "og:type", type);
  setMetaTag('meta[property="og:url"]', "property", "og:url", url);
  setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");

  if (image) {
    setMetaTag('meta[property="og:image"]', "property", "og:image", image);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", image);
  }

  setCanonical(url);
}
