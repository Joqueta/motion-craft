import { getPath } from "./path.js";

const PLACEHOLDER = /\{\{\s*([\w.[\]]+)\s*\}\}/g;

function interpolate(data = {}) {
  return this.replace(PLACEHOLDER, (_, path) => {
    const value = getPath(data, path);
    return value === undefined || value === null ? "" : String(value);
  });
}

Object.defineProperty(String.prototype, "interpolate", {
  value: interpolate,
  writable: true,
  configurable: true,
  enumerable: false,
});

export default interpolate;
