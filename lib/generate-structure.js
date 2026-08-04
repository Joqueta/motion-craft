import { setAttribute } from "./attributes.js";

export function normalize(node) {
  if (node === null || node === undefined || node === false || node === true) return null;
  if (typeof node === "string" || typeof node === "number") return String(node);

  let current = node;
  while (typeof current.type === "function") {
    const props = Object.fromEntries(current.attributes ?? []);
    if (current.children) props.children = current.children;
    current = current.type(props);
    if (current === null || current === undefined) return null;
    if (typeof current === "string" || typeof current === "number") return String(current);
  }

  return {
    type: current.type,
    key: current.key,
    attributes: new Map(current.attributes ?? []),
    events: new Map(current.events ?? []),
    children: (current.children ?? []).map(normalize).filter((child) => child !== null),
  };
}

export function createElement(vnode) {
  if (vnode === null) return document.createTextNode("");
  if (typeof vnode === "string") return document.createTextNode(vnode);

  const element = document.createElement(vnode.type);
  vnode.attributes.forEach((value, name) => setAttribute(element, name, value));
  vnode.events.forEach((handler, name) => element.addEventListener(name, handler));
  vnode.children.forEach((child) => element.appendChild(createElement(child)));
  return element;
}

export default function generateStructure(structure) {
  return createElement(normalize(structure));
}
