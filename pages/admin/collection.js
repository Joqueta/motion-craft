import portfolioStore, { editContent, notify, recordAudit } from "../../store/portfolio-store.js";
import { uploadFritziMedia } from "../../services/fritzi-admin-service.js";

export function handleMediaUpload(file, alt) {
  return uploadFritziMedia(file, alt).then((media) => {
    const current = portfolioStore.get("fritziMedia") ?? [];
    portfolioStore.update({ fritziMedia: [media, ...current] });
    notify("Image envoyée.", "success");
    recordAudit("Image envoyée depuis le back-office", media.name);
    return media;
  });
}

export function items(collection, root = "content") {
  return portfolioStore.get(`${root}.${collection}`) ?? [];
}

export function addItem(collection, factory, root = "content") {
  editContent(collection, [...items(collection, root), factory()], root);
  recordAudit("Ajout d'un élément", collection);
}

export function removeItem(collection, index, root = "content") {
  editContent(
    collection,
    items(collection, root).filter((_, position) => position !== index),
    root,
  );
  recordAudit("Suppression d'un élément", collection);
}

export function moveItem(collection, index, offset, root = "content") {
  const list = [...items(collection, root)];
  const target = index + offset;
  if (target < 0 || target >= list.length) return;
  [list[index], list[target]] = [list[target], list[index]];
  editContent(collection, list, root);
}

export function bindField(collection, index, field, root = "content") {
  return (value) => editContent(`${collection}.${index}.${field}`, value, root);
}

export function ItemToolbar(collection, index, total, label, disabled = false, root = "content") {
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
        events: [["click", () => moveItem(collection, index, -1, root)]],
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
        events: [["click", () => moveItem(collection, index, 1, root)]],
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
        events: [["click", () => removeItem(collection, index, root)]],
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
      ["class", ["button", "button--primary", "button--add"]],
      ["disabled", disabled],
    ],
    events: [["click", onClick]],
    children: [label],
  };
}
