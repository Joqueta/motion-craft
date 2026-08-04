import defineComponent from "../../lib/props.js";
import { navigate } from "./browser-router.js";

const Link = defineComponent(
  "Link",
  {
    to: { type: "string", required: true },
    label: { type: "string", default: "" },
    className: { type: "string", default: "" },
    active: { type: "boolean", default: false },
    children: { type: "array", default: [] },
  },
  ({ to, label, className, active, children }) => ({
    type: "a",
    attributes: [
      ["href", to],
      ["class", [className, active ? "is-active" : ""]],
      ["aria-current", active ? "page" : false],
    ],
    events: [
      [
        "click",
        (event) => {
          if (event.metaKey || event.ctrlKey || event.button !== 0) return;
          event.preventDefault();
          navigate(to);
        },
      ],
    ],
    children: label ? [label] : children,
  }),
);

export default Link;
