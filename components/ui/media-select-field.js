import defineComponent from "../../lib/props.js";
import Field from "./field.js";
import { notify } from "../../store/portfolio-store.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function handleFileChange(event, { id, onUpload, onSelect }) {
  const input = event.target;
  const file = input.files?.[0];
  if (!file) return;

  const altInput = document.getElementById(`${id}-alt`);
  const alt = altInput?.value.trim() ?? "";

  if (!alt) {
    notify("Renseignez un texte alternatif avant d'envoyer le fichier.", "warning");
    input.value = "";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    notify("Fichier trop volumineux : 10 Mo maximum.", "warning");
    input.value = "";
    return;
  }

  input.disabled = true;
  onUpload(file, alt)
    .then((media) => {
      onSelect({ id: media.id, url: media.url });
      if (altInput) altInput.value = "";
    })
    .catch((error) => notify(`Envoi impossible : ${error.message}`, "error"))
    .finally(() => {
      input.value = "";
      input.disabled = false;
    });
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
    onSelect: { type: "function", required: true },
    onUpload: { type: "function", required: true },
  },
  ({ id, label, value, media, hint, disabled, onSelect, onUpload }) => {
    const options = [
      { value: "", label: "— Aucune image —" },
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
        {
          type: "div",
          attributes: [["class", ["media-select-field__upload"]]],
          children: [
            Field({
              id: `${id}-alt`,
              label: "Texte alternatif",
              placeholder: "Décrit l'image pour les lecteurs d'écran",
              value: "",
              disabled,
              onInput: () => {},
            }),
            {
              type: "label",
              attributes: [
                ["for", `${id}-file`],
                ["class", ["field__label"]],
              ],
              children: ["Envoyer une nouvelle image"],
            },
            {
              type: "input",
              attributes: [
                ["id", `${id}-file`],
                ["type", "file"],
                ["accept", "image/*"],
                ["class", ["field__control"]],
                ["disabled", disabled],
              ],
              events: [["change", (event) => handleFileChange(event, { id, onUpload, onSelect })]],
            },
          ],
        },
      ],
    };
  },
);

export default MediaSelectField;
