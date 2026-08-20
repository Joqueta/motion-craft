import Link from "../../router/link.js";

export function ProfileCard(profile) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return {
    type: "aside",
    attributes: [
      ["class", ["profile-card"]],
      ["aria-labelledby", "profile-card-heading"],
    ],
    children: [
      { type: "h2", attributes: [["id", "profile-card-heading"]], children: ["Profile"] },
      { type: "p", attributes: [["class", ["profile-card__name"]]], children: [fullName || "—"] },
      profile.role
        ? { type: "p", attributes: [["class", ["profile-card__role"]]], children: [profile.role] }
        : null,
      profile.statusLabel
        ? {
            type: "span",
            attributes: [["class", ["badge", profile.statusActive ? "badge--published" : "badge--draft"]]],
            children: [profile.statusLabel],
          }
        : null,
      profile.location
        ? { type: "p", attributes: [["class", ["profile-card__location"]]], children: [profile.location] }
        : null,
      profile.bio
        ? { type: "p", attributes: [["class", ["profile-card__bio"]]], children: [profile.bio] }
        : null,
      {
        type: "ul",
        attributes: [["class", ["profile-card__contacts"]]],
        children: [
          profile.email
            ? {
                type: "li",
                children: [{ type: "a", attributes: [["href", `mailto:${profile.email}`]], children: [profile.email] }],
              }
            : null,
          profile.linkedin
            ? {
                type: "li",
                children: [
                  {
                    type: "a",
                    attributes: [["href", profile.linkedin], ["target", "_blank"], ["rel", "noreferrer"]],
                    children: ["LinkedIn"],
                  },
                ],
              }
            : null,
          profile.instagram
            ? {
                type: "li",
                children: [
                  {
                    type: "a",
                    attributes: [["href", profile.instagram], ["target", "_blank"], ["rel", "noreferrer"]],
                    children: ["Instagram"],
                  },
                ],
              }
            : null,
        ].filter(Boolean),
      },
      Link({ to: "/fritzi/admin/pages/profil", label: "Edit profile", className: "button" }),
    ].filter(Boolean),
  };
}
