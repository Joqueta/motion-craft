import defineComponent from "../../lib/props.js";

function buildControl({ id, control, inputType, value, placeholder, options, onInput, rows, required, disabled }) {
  const shared = [
    ["id", id],
    ["name", id],
    ["class", ["field__control"]],
    ["value", value],
    ["required", required],
    ["disabled", disabled],
  ];

  if (control === "textarea") {
    return {
      type: "textarea",
      attributes: [...shared, ["rows", rows], ["placeholder", placeholder]],
      events: [["input", (event) => onInput(event.target.value)]],
      children: [],
    };
  }

  if (control === "select") {
    return {
      type: "select",
      attributes: shared,
      events: [["change", (event) => onInput(event.target.value)]],
      children: options.map((option) => ({
        type: "option",
        key: String(option.value),
        attributes: [
          ["value", option.value],
          ["selected", String(option.value) === String(value)],
        ],
        children: [option.label],
      })),
    };
  }

  if (control === "checkbox") {
    return {
      type: "input",
      attributes: [
        ["id", id],
        ["name", id],
        ["type", "checkbox"],
        ["class", ["field__checkbox"]],
        ["checked", Boolean(value)],
        ["disabled", disabled],
      ],
      events: [["change", (event) => onInput(event.target.checked)]],
    };
  }

  return {
    type: "input",
    attributes: [...shared, ["type", inputType], ["placeholder", placeholder]],
    events: [["input", (event) => onInput(event.target.value)]],
  };
}

const Field = defineComponent(
  "Field",
  {
    id: { type: "string", required: true },
    label: { type: "string", required: true },
    value: { required: false },
    onInput: { type: "function", required: true },
    control: { type: "string", default: "input", values: ["input", "textarea", "select", "checkbox"] },
    inputType: { type: "string", default: "text" },
    placeholder: { type: "string", default: "" },
    options: { type: "array", default: [] },
    hint: { type: "string", default: "" },
    rows: { type: "number", default: 4 },
    required: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
  },
  (props) => ({
    type: "div",
    attributes: [["class", ["field", props.control === "checkbox" ? "field--inline" : ""]]],
    children: [
      {
        type: "label",
        attributes: [
          ["for", props.id],
          ["class", ["field__label"]],
        ],
        children: [props.label],
      },
      buildControl({ ...props, value: props.value ?? "" }),
      props.hint
        ? {
            type: "p",
            attributes: [["class", ["field__hint"]]],
            children: [props.hint],
          }
        : null,
    ].filter(Boolean),
  }),
);

export default Field;
