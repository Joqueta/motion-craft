import defineComponent from "../../lib/props.js";
import Field from "./field.js";

function UploadRow({ id, label, disabled, uploading, onUpload }) {
  const altId = `${id}-alt`;

  return {
    type: "div",
    attributes: [["class", ["field__upload"]]],
    children: [
      {
        type: "input",
        attributes: [
          ["id", altId],
          ["type", "text"],
          ["class", ["field__control"]],
          ["placeholder", "Texte alternatif (optionnel)"],
          ["disabled", disabled || uploading],
        ],
      },
      {
        type: "input",
        attributes: [
          ["id", `${id}-file`],
          ["type", "file"],
          ["accept", "image/*"],
          ["class", ["field__control"]],
          ["disabled", disabled || uploading],
        ],
        events: [
          [
            "change",
            (event) => {
              const input = event.target;
              const file = input.files?.[0];
              if (!file) return;

              const alt = document.getElementById(altId)?.value?.trim() || label;
              Promise.resolve(onUpload(file, alt)).finally(() => {
                input.value = "";
              });
            },
          ],
        ],
      },
      uploading
        ? { type: "p", attributes: [["class", ["field__hint"]]], children: ["Envoi en cours…"] }
        : null,
    ].filter(Boolean),
  };
}

const MediaSelectField = defineComponent(
  "MediaSelectField",
  {
    id: { type: "string", required: true },
    label: { type: "string", required: true },
    value: { required: false },
    media: { type: "array", default: [] },
    hint: { type: "string", default: "" },
    disabled: { type: "boolean", default: false },
    uploading: { type: "boolean", default: false },
    onSelect: { type: "function", required: true },
    onUpload: { type: "function", required: false },
  },
  ({ id, label, value, media, hint, disabled, uploading, onSelect, onUpload }) => {
    const options = [
      { value: "", label: "- Aucune image -" },
      ...media.map((file) => ({ value: String(file.id), label: file.name })),
    ];

    return {
      type: "div",
      attributes: [["class", ["media-select-field"]]],
      children: [
        Field({
          id,
          label,
          control: "select",
          value: value?.id ? String(value.id) : "",
          options,
          hint,
          disabled,
          onInput: (raw) => {
            const file = media.find((item) => String(item.id) === String(raw));
            onSelect(file ? { id: file.id, url: file.url } : null);
          },
        }),
        onUpload ? UploadRow({ id, label, disabled, uploading, onUpload }) : null,
      ].filter(Boolean),
    };
  },
);

export default MediaSelectField;
