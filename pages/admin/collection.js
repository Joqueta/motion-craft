import portfolioStore, { editContent, recordAudit } from "../../store/portfolio-store.js";

export function items(collection) {
  return portfolioStore.get(`content.${collection}`) ?? [];
}

export function addItem(collection, factory) {
  editContent(collection, [...items(collection), factory()]);
  recordAudit("Ajout d'un élément", collection);
}

export function removeItem(collection, index) {
  editContent(
    collection,
    items(collection).filter((_, position) => position !== index),
  );
  recordAudit("Suppression d'un élément", collection);
}

export function moveItem(collection, index, offset) {
  const list = [...items(collection)];
  const target = index + offset;
  if (target < 0 || target >= list.length) return;
  [list[index], list[target]] = [list[target], list[index]];
  editContent(collection, list);
}

export function bindField(collection, index, field) {
  return (value) => editContent(`${collection}.${index}.${field}`, value);
}

export function ItemToolbar(collection, index, total, label, disabled = false) {
  return {
    type: "div",
    attributes: [["class", ["editor-item__toolbar"]]],
    children: [
      {
        type: "button",
        attributes: [
          ["type", "button"],
          ["class", ["icon-button"]],
          ["aria-label", `Monter ${label}`],
          ["disabled", disabled || index === 0],
        ],
        events: [["click", () => moveItem(collection, index, -1)]],
        children: ["↑"],
      },
      {
        type: "button",
        attributes: [
          ["type", "button"],
          ["class", ["icon-button"]],
          ["aria-label", `Descendre ${label}`],
          ["disabled", disabled || index === total - 1],
        ],
        events: [["click", () => moveItem(collection, index, 1)]],
        children: ["↓"],
      },
      {
        type: "button",
        attributes: [
          ["type", "button"],
          ["class", ["icon-button", "icon-button--danger"]],
          ["aria-label", `Supprimer ${label}`],
          ["disabled", disabled],
        ],
        events: [["click", () => removeItem(collection, index)]],
        children: ["✕"],
      },
    ],
  };
}

export function AddButton(label, onClick, disabled = false) {
  return {
    type: "button",
    attributes: [
      ["type", "button"],
      ["class", ["button", "button--primary"]],
      ["disabled", disabled],
    ],
    events: [["click", onClick]],
    children: [label],
  };
}
