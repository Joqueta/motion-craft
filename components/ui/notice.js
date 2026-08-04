import defineComponent from "../../lib/props.js";
import { clearNotice } from "../../store/portfolio-store.js";

const Notice = defineComponent(
  "Notice",
  {
    message: { type: "string", required: true },
    tone: { type: "string", default: "info", values: ["info", "success", "warning", "error"] },
    dismissible: { type: "boolean", default: true },
  },
  ({ message, tone, dismissible }) => ({
    type: "div",
    attributes: [
      ["class", ["notice", `notice--${tone}`]],
      ["role", tone === "error" ? "alert" : "status"],
    ],
    children: [
      { type: "p", attributes: [["class", ["notice__text"]]], children: [message] },
      dismissible
        ? {
            type: "button",
            attributes: [
              ["type", "button"],
              ["class", ["notice__close"]],
              ["aria-label", "Fermer le message"],
            ],
            events: [["click", clearNotice]],
            children: ["×"],
          }
        : null,
    ].filter(Boolean),
  }),
);

export default Notice;
