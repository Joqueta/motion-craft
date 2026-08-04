import { isSameAttribute, removeAttribute, setAttribute } from "./attributes.js";
import { createElement, normalize } from "./generate-structure.js";

function patchAttributes(element, previous, next) {
  previous.forEach((_, name) => {
    if (!next.has(name)) removeAttribute(element, name);
  });
  next.forEach((value, name) => {
    if (!isSameAttribute(previous.get(name), value)) setAttribute(element, name, value);
  });
}

function patchEvents(element, previous, next) {
  previous.forEach((handler, name) => {
    if (next.get(name) !== handler) element.removeEventListener(name, handler);
  });
  next.forEach((handler, name) => {
    if (previous.get(name) !== handler) element.addEventListener(name, handler);
  });
}

function isKeyed(children) {
  return (
    children.length > 0 &&
    children.every((child) => typeof child !== "string" && child.key !== undefined)
  );
}

function patchKeyedChildren(parent, previous, next) {
  const nodes = Array.from(parent.childNodes);
  const pool = new Map();
  previous.forEach((child, index) => pool.set(child.key, { vnode: child, element: nodes[index] }));

  const ordered = next.map((child) => {
    const match = pool.get(child.key);
    if (!match) return createElement(child);
    pool.delete(child.key);
    return patchNode(match.element, match.vnode, child);
  });

  pool.forEach(({ element }) => element.remove());
  ordered.forEach((element, index) => {
    if (parent.childNodes[index] !== element) {
      parent.insertBefore(element, parent.childNodes[index] ?? null);
    }
  });
}

function patchChildren(parent, previous, next) {
  if (isKeyed(previous) && isKeyed(next)) {
    patchKeyedChildren(parent, previous, next);
    return;
  }

  const nodes = Array.from(parent.childNodes);
  const length = Math.max(previous.length, next.length);

  for (let index = 0; index < length; index++) {
    if (index >= next.length) nodes[index].remove();
    else if (index >= previous.length) parent.appendChild(createElement(next[index]));
    else patchNode(nodes[index], previous[index], next[index]);
  }
}

export function patchNode(element, previous, next) {
  if (previous === next) return element;

  if (typeof previous === "string" && typeof next === "string") {
    if (element.nodeValue !== next) element.nodeValue = next;
    return element;
  }

  if (typeof previous === "string" || typeof next === "string" || previous.type !== next.type) {
    const created = createElement(next);
    element.replaceWith(created);
    return created;
  }

  patchAttributes(element, previous.attributes, next.attributes);
  patchEvents(element, previous.events, next.events);
  patchChildren(element, previous.children, next.children);
  return element;
}

export function createRoot(container) {
  let current = null;

  return function render(structure) {
    const next = normalize(structure);

    if (next === null) {
      container.replaceChildren();
      current = null;
      return null;
    }

    if (current === null || container.firstChild === null) {
      container.replaceChildren(createElement(next));
    } else {
      patchNode(container.firstChild, current, next);
    }

    current = next;
    return container.firstChild;
  };
}
