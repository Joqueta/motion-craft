import Field from "../../components/ui/field.js";
import Notice from "../../components/ui/notice.js";
import portfolioStore, { editContent } from "../../store/portfolio-store.js";
import { AddButton, ItemToolbar } from "./collection.js";

function bind(field) {
  return (value) => editContent(`profile.${field}`, value);
}

function LinksEditor(links, readOnly) {
  return {
    type: "fieldset",
    attributes: [["class", ["editor-group"]]],
    children: [
      { type: "legend", children: ["Liens externes"] },
      ...links.map((link, index) => ({
        type: "div",
        key: `link-${index}`,
        attributes: [["class", ["editor-item", "editor-item--row"]]],
        children: [
          Field({
            id: `link-label-${index}`,
            label: "Intitulé",
            value: link.label,
            placeholder: "GitHub",
            disabled: readOnly,
            onInput: (value) => editContent(`profile.links.${index}.label`, value),
          }),
          Field({
            id: `link-url-${index}`,
            label: "URL",
            inputType: "url",
            value: link.url,
            placeholder: "https://github.com/mon-compte",
            disabled: readOnly,
            onInput: (value) => editContent(`profile.links.${index}.url`, value),
          }),
          ItemToolbar("profile.links", index, links.length, "le lien", readOnly),
        ],
      })),
      AddButton(
        "Ajouter un lien",
        () => editContent("profile.links", [...links, { label: "", url: "" }]),
        readOnly,
      ),
    ],
  };
}

export default function ProfileSection() {
  const profile = portfolioStore.get("content.profile");
  const readOnly = portfolioStore.get("session")?.role === "reader";

  return {
    type: "section",
    attributes: [["class", ["editor"]], ["aria-labelledby", "editor-profil"]],
    children: [
      { type: "h2", attributes: [["id", "editor-profil"]], children: ["Informations personnelles"] },
      readOnly
        ? Notice({
            message: "Rôle lecteur : ces champs sont affichés en lecture seule et ne peuvent pas être modifiés.",
            tone: "info",
            dismissible: false,
          })
        : null,
      {
        type: "div",
        attributes: [["class", ["editor-grid"]]],
        children: [
          Field({
            id: "profile-name",
            label: "Nom complet",
            value: profile.name,
            required: true,
            placeholder: "Prénom Nom",
            disabled: readOnly,
            onInput: bind("name"),
          }),
          Field({
            id: "profile-title",
            label: "Titre professionnel",
            value: profile.title,
            placeholder: "Chef de projet digital",
            disabled: readOnly,
            onInput: bind("title"),
          }),
          Field({
            id: "profile-email",
            label: "Email",
            inputType: "email",
            value: profile.email,
            placeholder: "prenom.nom@exemple.fr",
            disabled: readOnly,
            onInput: bind("email"),
          }),
          Field({
            id: "profile-phone",
            label: "Téléphone",
            inputType: "tel",
            value: profile.phone,
            placeholder: "06 00 00 00 00",
            disabled: readOnly,
            onInput: bind("phone"),
          }),
          Field({
            id: "profile-location",
            label: "Localisation",
            value: profile.location,
            placeholder: "Paris, France",
            disabled: readOnly,
            onInput: bind("location"),
          }),
          Field({
            id: "profile-avatar",
            label: "Photo (URL)",
            inputType: "url",
            value: profile.avatar,
            hint: "Laissez vide pour afficher vos initiales.",
            disabled: readOnly,
            onInput: bind("avatar"),
          }),
        ],
      },
      Field({
        id: "profile-bio",
        label: "Biographie",
        control: "textarea",
        rows: 6,
        value: profile.bio,
        hint: "Une ligne vide sépare deux paragraphes.",
        disabled: readOnly,
        onInput: bind("bio"),
      }),
      Field({
        id: "profile-seo",
        label: "Meta description (SEO)",
        control: "textarea",
        rows: 3,
        value: profile.seoDescription,
        hint: "160 caractères maximum, affichés dans les résultats de recherche.",
        disabled: readOnly,
        onInput: bind("seoDescription"),
      }),
      LinksEditor(profile.links ?? [], readOnly),
    ].filter(Boolean),
  };
}
