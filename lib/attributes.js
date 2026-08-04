const PROPERTY_ATTRIBUTES = new Set(["value", "checked", "selected", "disabled"]);

function toClassName(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(" ");
  return value ?? "";
}

function toStyleEntries(value) {
  if (Array.isArray(value)) return value;
  return Object.entries(value ?? {});
}

function toCssProperty(name) {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function toDatasetKey(name) {
  return name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function setAttribute(element, name, value) {
  if (name === "class") {
    element.className = toClassName(value);
    return;
  }

  if (name === "style") {
    element.style.cssText = "";
    for (const [property, propertyValue] of toStyleEntries(value)) {
      element.style.setProperty(toCssProperty(property), propertyValue);
    }
    return;
  }

  if (name.startsWith("data-")) {
    element.dataset[toDatasetKey(name)] = value;
    return;
  }

  if (PROPERTY_ATTRIBUTES.has(name)) {
    if (element[name] !== value) element[name] = value;
    return;
  }

  if (value === false || value === null || value === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value === true ? "" : value);
}

export function removeAttribute(element, name) {
  if (name === "class") {
    element.className = "";
    return;
  }

  if (name === "style") {
    element.style.cssText = "";
    return;
  }

  if (name.startsWith("data-")) {
    delete element.dataset[toDatasetKey(name)];
    return;
  }

  if (PROPERTY_ATTRIBUTES.has(name)) {
    element[name] = typeof element[name] === "boolean" ? false : "";
    return;
  }

  element.removeAttribute(name);
}

export function isSameAttribute(previous, next) {
  if (previous === next) return true;
  if (Array.isArray(previous) && Array.isArray(next)) {
    return previous.length === next.length && previous.every((item, index) => item === next[index]);
  }
  return false;
}
