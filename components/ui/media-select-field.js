import defineComponent from "../../lib/props.js";
import Field from "./field.js";

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
  },
  ({ id, label, value, media, hint, disabled, onSelect }) => {
    const options = [
      { value: "", label: "— Aucune image —" },
      ...media.map((file) => ({ value: String(file.id), label: file.name })),
    ];

    return Field({
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
    });
  },
);

export default MediaSelectField;
