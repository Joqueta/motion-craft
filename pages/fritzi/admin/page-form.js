import Field from "../../../components/ui/field.js";
import MediaSelectField from "../../../components/ui/media-select-field.js";
import Notice from "../../../components/ui/notice.js";
import Link from "../../../components/router/link.js";
import { AdminNav } from "../../../components/fritzi/admin/admin-nav.js";
import setMeta from "../../../lib/seo.js";
import portfolioStore, { editContent, notify, recordAudit } from "../../../store/portfolio-store.js";
import { items, addItem, ItemToolbar, AddButton, bindField } from "../../admin/collection.js";
import { loadFritziPage, saveFritziPage, missingPageFields, loadMediaLibrary, uploadFritziMedia } from "../../../services/fritzi-admin-service.js";

const ROOT = "fritziPageForm";
const PAGE_TITLES = { home: "Home", about: "About", contact: "Contact", profil: "Profile" };

let loadedKey = null;

function bind(path) {
  return (value) => editContent(path, value, ROOT);
}

function handleMediaUpload(file, alt) {
  return uploadFritziMedia(file, alt).then((media) => {
    const current = portfolioStore.get("fritziMedia") ?? [];
    portfolioStore.update({ fritziMedia: [media, ...current] });
    return media;
  });
}

function startLoad(page) {
  portfolioStore.update({ fritziFormStatus: "loading" });
  Promise.all([loadFritziPage(page), loadMediaLibrary()])
    .then(([data, media]) => {
      loadedKey = page;
      portfolioStore.update({ fritziPageForm: data, fritziMedia: media, fritziFormStatus: "ready" });
    })
    .catch((error) => {
      loadedKey = page;
      notify(`Unable to load: ${error.message}`, "error");
      portfolioStore.update({ fritziFormStatus: "ready", fritziPageForm: null });
    });
}

function save(page) {
  const data = portfolioStore.get(ROOT);
  const missing = missingPageFields(page, data);
  if (missing.length) {
    notify(`Missing required fields: ${missing.join(", ")}`, "error");
    return;
  }

  portfolioStore.update({ fritziFormStatus: "saving" });
  saveFritziPage(page, data)
    .then((saved) => {
      portfolioStore.update({ fritziPageForm: saved, fritziFormStatus: "ready" });
      recordAudit("Saved a fritzi page", PAGE_TITLES[page]);
      notify("Page saved.", "success");
    })
    .catch((error) => {
      portfolioStore.update({ fritziFormStatus: "ready" });
      notify(`Save failed: ${error.message}`, "error");
    });
}

function RelatedWorkFields(offeringPath, relatedWork, readOnly) {
  const path = `${offeringPath}.relatedWork`;
  return {
    type: "div",
    attributes: [["class", ["editor-list"]]],
    children: [
      { type: "h4", children: ["Related projects"] },
      ...relatedWork.map((entry, index) => ({
        type: "div",
        key: String(index),
        attributes: [["class", ["editor-item"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["editor-item__head"]]],
            children: [ItemToolbar(path, index, relatedWork.length, `related project ${index + 1}`, readOnly, ROOT)],
          },
          {
            type: "div",
            attributes: [["class", ["editor-grid"]]],
            children: [
              Field({
                id: `${path}-${index}-label`,
                label: "Label",
                value: entry.label,
                placeholder: "e.g. Related project",
                disabled: readOnly,
                onInput: bindField(path, index, "label", ROOT),
              }),
              Field({
                id: `${path}-${index}-slug`,
                label: "Project slug",
                value: entry.slug,
                placeholder: "project-slug",
                disabled: readOnly,
                onInput: bindField(path, index, "slug", ROOT),
              }),
            ],
          },
        ],
      })),
      AddButton("Add a related project", () => addItem(path, () => ({ label: "", slug: "" }), ROOT), readOnly),
    ],
  };
}

function OfferingsSection(readOnly) {
  const list = items("offerings", ROOT);
  return {
    type: "section",
    attributes: [["class", ["editor-list"]], ["aria-labelledby", "offerings-heading"]],
    children: [
      { type: "h2", attributes: [["id", "offerings-heading"]], children: ["Offerings"] },
      ...list.map((offering, index) => {
        const path = `offerings.${index}`;
        return {
          type: "div",
          key: String(index),
          attributes: [["class", ["editor-item"]]],
          children: [
            {
              type: "div",
              attributes: [["class", ["editor-item__head"]]],
              children: [
                { type: "h3", children: [offering.title || `Offering ${index + 1}`] },
                ItemToolbar("offerings", index, list.length, offering.title || `offering ${index + 1}`, readOnly, ROOT),
              ],
            },
            {
              type: "div",
              attributes: [["class", ["editor-grid"]]],
              children: [
                Field({
                  id: `${path}-number`,
                  label: "Number",
                  value: offering.number,
                  placeholder: "e.g. 01",
                  disabled: readOnly,
                  onInput: bindField("offerings", index, "number", ROOT),
                }),
                Field({
                  id: `${path}-title`,
                  label: "Title",
                  value: offering.title,
                  placeholder: "e.g. Front-end",
                  disabled: readOnly,
                  onInput: bindField("offerings", index, "title", ROOT),
                }),
                Field({
                  id: `${path}-tag`,
                  label: "Tag",
                  value: offering.tag,
                  placeholder: "e.g. Development",
                  disabled: readOnly,
                  onInput: bindField("offerings", index, "tag", ROOT),
                }),
                Field({
                  id: `${path}-tools`,
                  label: "Tools",
                  value: offering.tools,
                  placeholder: "e.g. HTML5, CSS3, JavaScript",
                  disabled: readOnly,
                  onInput: bindField("offerings", index, "tools", ROOT),
                }),
                Field({
                  id: `${path}-work`,
                  label: "Key points (work)",
                  control: "textarea",
                  rows: 3,
                  value: offering.work,
                  hint: "One line = one point.",
                  placeholder: "One line = one point",
                  disabled: readOnly,
                  onInput: bindField("offerings", index, "work", ROOT),
                }),
              ],
            },
            RelatedWorkFields(path, offering.relatedWork, readOnly),
          ],
        };
      }),
      AddButton(
        "Add an offering",
        () => addItem("offerings", () => ({ number: "", title: "", tag: "", tools: "", work: "", relatedWork: [] }), ROOT),
        readOnly,
      ),
    ],
  };
}

function HomeFields(data, readOnly, media) {
  return [
    { type: "h2", children: ["\"About\" section"] },
    {
      type: "div",
      attributes: [["class", ["editor-grid"]]],
      children: [
        Field({ id: "home-about-heading", label: "Section title", value: data.aboutHeading, placeholder: "Section title", required: true, disabled: readOnly, onInput: bind("aboutHeading") }),
        Field({ id: "home-quote-lead", label: "Quote — opening", value: data.quoteLead, placeholder: "Quote opening", required: true, disabled: readOnly, onInput: bind("quoteLead") }),
        Field({ id: "home-quote-highlight-1", label: "Quote — highlight 1", value: data.quoteHighlight1, placeholder: "Highlighted word 1", required: true, disabled: readOnly, onInput: bind("quoteHighlight1") }),
        Field({ id: "home-quote-connector", label: "Quote — connector", value: data.quoteConnector, placeholder: "e.g. and a", required: true, disabled: readOnly, onInput: bind("quoteConnector") }),
        Field({ id: "home-quote-highlight-2", label: "Quote — highlight 2", value: data.quoteHighlight2, placeholder: "Highlighted word 2", required: true, disabled: readOnly, onInput: bind("quoteHighlight2") }),
        Field({ id: "home-quote-tail", label: "Quote — closing", value: data.quoteTail, placeholder: "Quote closing", required: true, disabled: readOnly, onInput: bind("quoteTail") }),
        Field({ id: "home-about-caption", label: "Portrait caption", control: "textarea", rows: 3, value: data.aboutCaption, placeholder: "Portrait caption", required: true, disabled: readOnly, onInput: bind("aboutCaption") }),
        MediaSelectField({ id: "home-about-portrait", label: "Portrait", value: data.aboutPortrait, media, disabled: readOnly, onSelect: bind("aboutPortrait"), onUpload: handleMediaUpload }),
      ],
    },
    { type: "h2", children: ["\"Skills\" section"] },
    {
      type: "div",
      attributes: [["class", ["editor-grid"]]],
      children: [
        Field({ id: "home-skills-eyebrow", label: "Eyebrow", value: data.skillsEyebrow, placeholder: "e.g. My offerings", required: true, disabled: readOnly, onInput: bind("skillsEyebrow") }),
        Field({ id: "home-skills-line-1", label: "Title — line 1", value: data.skillsLine1, placeholder: "Title line 1", required: true, disabled: readOnly, onInput: bind("skillsLine1") }),
        Field({ id: "home-skills-connector", label: "Title — connector", value: data.skillsConnector, placeholder: "e.g. and", required: true, disabled: readOnly, onInput: bind("skillsConnector") }),
        Field({ id: "home-skills-line-2", label: "Title — line 2", value: data.skillsLine2, placeholder: "Title line 2", required: true, disabled: readOnly, onInput: bind("skillsLine2") }),
        Field({ id: "home-skills-paragraphs", label: "Paragraphs", control: "textarea", rows: 5, value: data.skillsParagraphs, hint: "One line = one paragraph.", placeholder: "One line = one paragraph", required: true, disabled: readOnly, onInput: bind("skillsParagraphs") }),
        Field({ id: "home-cv-label", label: "CV button label", value: data.cvLabel, placeholder: "e.g. Upload my CV here", required: true, disabled: readOnly, onInput: bind("cvLabel") }),
        MediaSelectField({ id: "home-offerings-image", label: "Offerings image", value: data.offeringsImage, media, disabled: readOnly, onSelect: bind("offeringsImage"), onUpload: handleMediaUpload }),
      ],
    },
    OfferingsSection(readOnly),
  ];
}

function AboutFields(data, readOnly, media) {
  return [
    { type: "h2", children: ["Hero"] },
    {
      type: "div",
      attributes: [["class", ["editor-grid"]]],
      children: [
        Field({ id: "about-hero-role", label: "Role", value: data.heroRole, placeholder: "e.g. Junior Fullstack Developer", required: true, disabled: readOnly, onInput: bind("heroRole") }),
        Field({ id: "about-hero-location-label", label: "Location label", value: data.heroLocationLabel, placeholder: "e.g. Based in", required: true, disabled: readOnly, onInput: bind("heroLocationLabel") }),
        Field({ id: "about-hero-location", label: "Location", value: data.heroLocation, placeholder: "e.g. Paris, France", required: true, disabled: readOnly, onInput: bind("heroLocation") }),
        Field({ id: "about-hero-paragraphs", label: "Paragraphs", control: "textarea", rows: 5, value: data.heroParagraphs, hint: "One line = one paragraph.", placeholder: "One line = one paragraph", required: true, disabled: readOnly, onInput: bind("heroParagraphs") }),
        MediaSelectField({ id: "about-hero-portrait", label: "Portrait", value: data.heroPortrait, media, disabled: readOnly, onSelect: bind("heroPortrait"), onUpload: handleMediaUpload }),
      ],
    },
    OfferingsSection(readOnly),
  ];
}

function ContactFields(data, readOnly, media) {
  return [
    { type: "h2", children: ["Hero"] },
    {
      type: "div",
      attributes: [["class", ["editor-grid"]]],
      children: [
        MediaSelectField({ id: "contact-hero-portrait", label: "Portrait", value: data.heroPortrait, media, disabled: readOnly, onSelect: bind("heroPortrait"), onUpload: handleMediaUpload }),
      ],
    },
  ];
}

function ProfilFields(data, readOnly) {
  return [
    { type: "h2", children: ["Identity"] },
    {
      type: "div",
      attributes: [["class", ["editor-grid"]]],
      children: [
        Field({ id: "profil-first-name", label: "First name", value: data.firstName, placeholder: "Your first name", required: true, disabled: readOnly, onInput: bind("firstName") }),
        Field({ id: "profil-last-name", label: "Last name", value: data.lastName, placeholder: "Your last name", required: true, disabled: readOnly, onInput: bind("lastName") }),
        Field({ id: "profil-role", label: "Role", value: data.role, placeholder: "e.g. Junior Fullstack Developer", required: true, disabled: readOnly, onInput: bind("role") }),
        Field({ id: "profil-bio", label: "Bio", control: "textarea", rows: 4, value: data.bio, placeholder: "Short bio", required: true, disabled: readOnly, onInput: bind("bio") }),
        Field({ id: "profil-status-label", label: "Status label", value: data.statusLabel, placeholder: "e.g. Working at .decode", disabled: readOnly, onInput: bind("statusLabel") }),
        Field({ id: "profil-status-active", label: "Active status", control: "checkbox", value: data.statusActive, disabled: readOnly, onInput: bind("statusActive") }),
        Field({ id: "profil-location", label: "Location", value: data.location, placeholder: "e.g. Paris, France", disabled: readOnly, onInput: bind("location") }),
        Field({ id: "profil-year", label: "Year", value: data.year, placeholder: "e.g. 2026", disabled: readOnly, onInput: bind("year") }),
      ],
    },
    { type: "h2", children: ["Contact"] },
    {
      type: "div",
      attributes: [["class", ["editor-grid"]]],
      children: [
        Field({ id: "profil-email", label: "Email", inputType: "email", value: data.email, placeholder: "name@example.com", required: true, disabled: readOnly, onInput: bind("email") }),
        Field({ id: "profil-linkedin", label: "LinkedIn", value: data.linkedin, placeholder: "LinkedIn profile URL", disabled: readOnly, onInput: bind("linkedin") }),
        Field({ id: "profil-instagram", label: "Instagram", value: data.instagram, placeholder: "Instagram handle or URL", disabled: readOnly, onInput: bind("instagram") }),
        Field({ id: "profil-contact-heading", label: "Contact footer title", control: "textarea", rows: 3, value: data.contactHeading, hint: "One line = one title segment.", placeholder: "One line = one title segment", disabled: readOnly, onInput: bind("contactHeading") }),
      ],
    },
  ];
}

const FIELD_RENDERERS = { home: HomeFields, about: AboutFields, contact: ContactFields, profil: ProfilFields };

export default function FritziPageFormPage(props) {
  const session = portfolioStore.get("session");
  const page = props?.params?.page ?? "";

  if (!PAGE_TITLES[page]) {
    return {
      type: "div",
      attributes: [["class", ["app", "fritzi-admin"]]],
      children: [
        AdminNav(props?.path ?? "/fritzi/admin"),
        {
          type: "main",
          attributes: [["class", ["container"]]],
          children: [{ type: "h1", children: ["Unknown page"] }],
        },
      ],
    };
  }

  if (!session) {
    return {
      type: "div",
      attributes: [["class", ["app", "fritzi-admin"]]],
      children: [
        AdminNav(props?.path ?? "/fritzi/admin"),
        {
          type: "main",
          attributes: [["class", ["container", "admin-locked"]]],
          children: [
            {
              type: "div",
              attributes: [["class", ["admin-locked__intro"]]],
              children: [
                { type: "h1", children: ["Login required"] },
                { type: "p", children: [`Sign in with a Strapi account to manage the ${PAGE_TITLES[page]} page.`] },
                Link({
                  to: `/connexion?next=${encodeURIComponent(props?.path ?? "/fritzi/admin")}`,
                  label: "Sign in",
                  className: "button button--primary",
                }),
              ],
            },
          ],
        },
      ],
    };
  }

  if (page !== loadedKey && portfolioStore.get("fritziFormStatus") !== "loading") startLoad(page);

  setMeta({ title: `fritzi admin — ${PAGE_TITLES[page]} page`, description: "" });

  const status = portfolioStore.get("fritziFormStatus");
  const data = portfolioStore.get(ROOT);
  const media = portfolioStore.get("fritziMedia") ?? [];
  const notice = portfolioStore.get("notice");
  const readOnly = session.role === "reader";
  const saving = status === "saving";

  if (status === "loading" || !data) {
    return {
      type: "div",
      attributes: [["class", ["app", "fritzi-admin"]]],
      children: [
        AdminNav(props?.path ?? "/fritzi/admin"),
        notice ? Notice({ message: notice.message, tone: notice.tone }) : null,
        {
          type: "main",
          attributes: [["class", ["container", "admin-locked"]]],
          children: [{ type: "p", children: ["Loading…"] }],
        },
      ].filter(Boolean),
    };
  }

  return {
    type: "div",
    attributes: [["class", ["app", "fritzi-admin"]]],
    children: [
      AdminNav(props?.path ?? "/fritzi/admin"),
      notice ? Notice({ message: notice.message, tone: notice.tone }) : null,
      {
        type: "main",
        attributes: [["class", ["container", "admin-locked"]]],
        children: [
          {
            type: "section",
            attributes: [["class", ["editor"]], ["aria-labelledby", "page-form-heading"]],
            children: [
              { type: "h1", attributes: [["id", "page-form-heading"]], children: [`"${PAGE_TITLES[page]}" page`] },
              readOnly
                ? Notice({
                  message: "Reader role: these fields are shown in read-only mode.",
                  tone: "info",
                  dismissible: false,
                })
                : null,
              ...FIELD_RENDERERS[page](data, readOnly, media),
              {
                type: "button",
                attributes: [
                  ["type", "button"],
                  ["class", ["button", "button--primary"]],
                  ["disabled", readOnly || saving],
                ],
                events: [["click", () => save(page)]],
                children: [saving ? "Saving…" : "Save"],
              },
            ].filter(Boolean),
          },
        ],
      },
    ].filter(Boolean),
  };
}