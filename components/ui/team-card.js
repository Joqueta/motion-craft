import defineComponent from "../../lib/props.js";
import Link from "../router/link.js";
import { initials } from "../../lib/text.js";

const TeamCard = defineComponent(
  "TeamCard",
  {
    name: { type: "string", required: true },
    role: { type: "string", required: true },
    to: { type: "string", required: true },
  },
  ({ name, role, to }) =>
    Link({
      to,
      className: "team-card",
      children: [
        {
          type: "span",
          attributes: [["class", ["team-card__avatar"]], ["aria-hidden", "true"]],
          children: [initials(name)],
        },
        {
          type: "div",
          attributes: [["class", ["team-card__body"]]],
          children: [
            { type: "p", attributes: [["class", ["team-card__name"]]], children: [name] },
            { type: "p", attributes: [["class", ["team-card__role"]]], children: [role] },
          ],
        },
      ],
    }),
);

export default TeamCard;
