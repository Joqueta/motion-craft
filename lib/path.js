export function toKeys(path) {
  return String(path)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter((key) => key !== "");
}

export function getPath(target, path) {
  return toKeys(path).reduce(
    (value, key) => (value === null || value === undefined ? undefined : value[key]),
    target,
  );
}

export function setPath(target, path, value) {
  const keys = toKeys(path);
  if (keys.length === 0) return value;

  const [key, ...rest] = keys;
  const base = Array.isArray(target) ? [...target] : { ...(target ?? {}) };
  base[key] = rest.length === 0 ? value : setPath(base[key], rest.join("."), value);
  return base;
}
