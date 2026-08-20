import Field from "../../../components/ui/field.js";
import MediaSelectField from "../../../components/ui/media-select-field.js";
import Notice from "../../../components/ui/notice.js";
import Link from "../../../components/router/link.js";
import { AdminNav } from "../../../components/fritzi/admin/admin-nav.js";
import { navigate } from "../../../components/router/browser-router.js";
import setMeta from "../../../lib/seo.js";
import portfolioStore, { editContent, notify, recordAudit } from "../../../store/portfolio-store.js";
import { items, addItem, ItemToolbar, AddButton, bindField } from "../../admin/collection.js";
import { STATES, stateLabel } from "../../../data/workflow.js";
import {
  loadFritziProjectDetail,
  loadFritziProjects,
  loadMediaLibrary,
  createFritziProject,
  saveFritziProjectDetail,
  deleteFritziProject,
  missingProjectFields,
  createEmptyProjectDetailItem,
} from "../../../services/fritzi-admin-service.js";

const ROOT = "fritziProjectForm";
const STATE_OPTIONS = STATES.map((state) => ({ value: state.value, label: state.label }));

let loadedKey = null;

function bind(path) {
  return (value) => editContent(path, value, ROOT);
}

function targetKey(slug) {
  return slug ? `edit:${slug}` : "new";
}

function startEdit(slug) {
  portfolioStore.update({ fritziFormStatus: "loading" });
  Promise.all([loadFritziProjectDetail(slug), loadMediaLibrary()])
    .then(([item, media]) => {
      loadedKey = targetKey(slug);
      if (!item) {
        notify(`Project "${slug}" not found.`, "error");
        portfolioStore.update({ fritziFormStatus: "ready", fritziMedia: media, fritziProjectForm: null });
        return;
      }
      portfolioStore.update({ fritziProjectForm: item, fritziMedia: media, fritziFormStatus: "ready" });
    })
    .catch((error) => {
      loadedKey = targetKey(slug);
      notify(`Unable to load: ${error.message}`, "error");
      portfolioStore.update({ fritziFormStatus: "ready", fritziProjectForm: null });
    });
}

function startCreate() {
  portfolioStore.update({ fritziFormStatus: "loading" });
  Promise.all([loadFritziProjects(), loadMediaLibrary()])
    .then(([projects, media]) => {
      const nextOrder = projects.reduce((max, project) => Math.max(max, project.order), -1) + 1;
      loadedKey = "new";
      portfolioStore.update({
        fritziProjectForm: { ...createEmptyProjectDetailItem(), order: nextOrder },
        fritziMedia: media,
        fritziFormStatus: "ready",
      });
    })
    .catch((error) => {
      loadedKey = "new";
      notify(`Unable to load: ${error.message}`, "error");
      portfolioStore.update({ fritziFormStatus: "ready", fritziProjectForm: null });
    });
}

function save() {
  const item = portfolioStore.get(ROOT);
  const missing = missingProjectFields(item);
  if (missing.length) {
    notify(`Missing required fields: ${missing.join(", ")}`, "error");
    return;
  }

  const isNew = !item.id;
  portfolioStore.update({ fritziFormStatus: "saving" });
  const request = isNew ? createFritziProject(item) : saveFritziProjectDetail(item.id, item);

  request
    .then((saved) => {
      loadedKey = targetKey(saved.slug);
      portfolioStore.update({ fritziProjectForm: saved, fritziFormStatus: "ready" });
      recordAudit(
        isNew ? "Created a fritzi project" : "Saved a fritzi project",
        saved.label || saved.slug,
      );
      notify(isNew ? "Project created." : "Project saved.", "success");
      if (isNew) navigate(`/fritzi/admin/projets/${saved.slug}`, { replace: true });
    })
    .catch((error) => {
      portfolioStore.update({ fritziFormStatus: "ready" });
      notify(`Save failed: ${error.message}`, "error");
    });
}

function removeProject() {
  const item = portfolioStore.get(ROOT);
  if (!item?.id) return;
  if (!window.confirm(`Permanently delete "${item.label || item.slug}"? This action cannot be undone.`)) return;

  portfolioStore.update({ fritziFormStatus: "saving" });
  deleteFritziProject(item.id)
    .then(() => {
      recordAudit("Deleted a fritzi project", item.label || item.slug);
      notify("Project deleted.", "success");
      navigate("/fritzi/admin");
    })
    .catch((error) => {
      portfolioStore.update({ fritziFormStatus: "ready" });
      notify(`Delete failed: ${error.message}`, "error");
    });
}

function TextImageBlockFields(basePath, block, media, readOnly, imageLabel, imageKey) {
  return {
    type: "div",
    attributes: [["class", ["editor-grid"]]],
    children: [
      Field({
        id: `${basePath}-eyebrow`,
        label: "Eyebrow",
        value: block.eyebrow,
        disabled: readOnly,
        onInput: bind(`${basePath}.eyebrow`),
      }),
      Field({
        id: `${basePath}-heading`,
        label: "Title",
        value: block.heading,
        disabled: readOnly,
        onInput: bind(`${basePath}.heading`),
      }),
      Field({
        id: `${basePath}-paragraphs`,
        label: "Paragraphs",
        control: "textarea",
        rows: 5,
        value: block.paragraphs,
        hint: "One line = one paragraph.",
        disabled: readOnly,
        onInput: bind(`${basePath}.paragraphs`),
      }),
      MediaSelectField({
        id: `${basePath}-image`,
        label: imageLabel,
        value: block[imageKey],
        media,
        disabled: readOnly,
        onSelect: bind(`${basePath}.${imageKey}`),
      }),
    ],
  };
}

function MetaSection(readOnly) {
  const list = items("meta", ROOT);
  return {
    type: "section",
    attributes: [["class", ["editor-list"]], ["aria-labelledby", "project-meta-heading"]],
    children: [
      { type: "h3", attributes: [["id", "project-meta-heading"]], children: ["Key info (meta)"] },
      ...list.map((entry, index) => ({
        type: "div",
        key: String(index),
        attributes: [["class", ["editor-item"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["editor-item__head"]]],
            children: [ItemToolbar("meta", index, list.length, `entry ${index + 1}`, readOnly, ROOT)],
          },
          {
            type: "div",
            attributes: [["class", ["editor-grid"]]],
            children: [
              Field({
                id: `meta-${index}-label`,
                label: "Label",
                value: entry.label,
                disabled: readOnly,
                onInput: bindField("meta", index, "label", ROOT),
              }),
              Field({
                id: `meta-${index}-value`,
                label: "Value",
                value: entry.value,
                disabled: readOnly,
                onInput: bindField("meta", index, "value", ROOT),
              }),
            ],
          },
        ],
      })),
      AddButton("Add an entry", () => addItem("meta", () => ({ label: "", value: "" }), ROOT), readOnly),
    ],
  };
}

export default function FritziProjectFormPage(props) {
  const session = portfolioStore.get("session");
  const slug = props?.params?.slug ?? null;
  const isNew = !slug;
  const path = props?.path ?? "/fritzi/admin";

  if (!session) {
    return {
      type: "div",
      attributes: [["class", ["app", "fritzi-admin"]]],
      children: [
        AdminNav(path),
        {
          type: "main",
          attributes: [["class", ["container", "admin-locked"]]],
          children: [
            {
              type: "div",
              attributes: [["class", ["admin-locked__intro"]]],
              children: [
                { type: "h1", children: ["Login required"] },
                { type: "p", children: ["Sign in with a Strapi account to manage fritzi projects."] },
                Link({
                  to: `/connexion?next=${encodeURIComponent(path)}`,
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

  const key = targetKey(slug);
  if (key !== loadedKey && portfolioStore.get("fritziFormStatus") !== "loading") {
    if (isNew) startCreate();
    else startEdit(slug);
  }

  setMeta({
    title: isNew ? "fritzi admin — new project" : "fritzi admin — edit project",
    description: "",
  });

  const status = portfolioStore.get("fritziFormStatus");
  const item = portfolioStore.get(ROOT);
  const media = portfolioStore.get("fritziMedia") ?? [];
  const notice = portfolioStore.get("notice");
  const readOnly = session.role === "reader";
  const saving = status === "saving";

  if (status === "loading" || !item) {
    return {
      type: "div",
      attributes: [["class", ["app", "fritzi-admin"]]],
      children: [
        AdminNav(path),
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
      AdminNav(path),
      notice ? Notice({ message: notice.message, tone: notice.tone }) : null,
      {
        type: "main",
        attributes: [["class", ["container", "admin-locked"]]],
        children: [
          {
            type: "section",
            attributes: [["class", ["editor"]], ["aria-labelledby", "project-form-heading"]],
            children: [
              {
                type: "h1",
                attributes: [["id", "project-form-heading"]],
                children: [isNew ? "New project" : `Edit "${item.label || item.slug}"`],
              },
              readOnly
                ? Notice({
                    message: "Reader role: these fields are shown in read-only mode.",
                    tone: "info",
                    dismissible: false,
                  })
                : null,

              { type: "h2", children: ["List fields"] },
              {
                type: "div",
                attributes: [["class", ["editor-grid"]]],
                children: [
                  Field({
                    id: "project-client",
                    label: "Client",
                    value: item.client,
                    required: true,
                    disabled: readOnly,
                    onInput: bind("client"),
                  }),
                  Field({
                    id: "project-label",
                    label: "Label",
                    value: item.label,
                    required: true,
                    disabled: readOnly,
                    onInput: bind("label"),
                  }),
                  Field({
                    id: "project-slug",
                    label: "Slug",
                    value: item.slug,
                    hint: "Leave empty to generate automatically from the title.",
                    disabled: readOnly,
                    onInput: bind("slug"),
                  }),
                  Field({
                    id: "project-state",
                    label: "Editorial state",
                    control: "select",
                    value: item.state,
                    options: STATE_OPTIONS,
                    hint: "Only the “Published” state is visible on the public site.",
                    disabled: readOnly,
                    onInput: (value) => {
                      bind("state")(value);
                      recordAudit(`Changed state to "${stateLabel(value)}"`, item.label || item.slug);
                    },
                  }),
                  Field({
                    id: "project-order",
                    label: "Order",
                    inputType: "number",
                    value: String(item.order),
                    disabled: readOnly,
                    onInput: (value) => bind("order")(Number(value) || 0),
                  }),
                  Field({
                    id: "project-featured",
                    label: "Featured on homepage",
                    control: "checkbox",
                    value: item.featured,
                    disabled: readOnly,
                    onInput: bind("featured"),
                  }),
                  MediaSelectField({
                    id: "project-cover",
                    label: "Cover image",
                    value: item.cover,
                    media,
                    disabled: readOnly,
                    onSelect: bind("cover"),
                  }),
                ],
              },

              { type: "h2", children: ["Detail fields"] },
              {
                type: "div",
                attributes: [["class", ["editor-grid"]]],
                children: [
                  Field({
                    id: "project-title",
                    label: "Title",
                    value: item.title,
                    required: true,
                    disabled: readOnly,
                    onInput: bind("title"),
                  }),
                  Field({
                    id: "project-eyebrow",
                    label: "Eyebrow",
                    value: item.eyebrow,
                    required: true,
                    disabled: readOnly,
                    onInput: bind("eyebrow"),
                  }),
                  MediaSelectField({
                    id: "project-hero-image",
                    label: "Main image",
                    value: item.heroImage,
                    media,
                    disabled: readOnly,
                    onSelect: bind("heroImage"),
                  }),
                ],
              },

              MetaSection(readOnly),

              { type: "h2", children: ["Overview"] },
              {
                type: "div",
                attributes: [["class", ["editor-grid"]]],
                children: [
                  Field({
                    id: "overview-side-label",
                    label: "Side label",
                    value: item.overview.sideLabel,
                    disabled: readOnly,
                    onInput: bind("overview.sideLabel"),
                  }),
                  Field({
                    id: "overview-eyebrow",
                    label: "Eyebrow",
                    value: item.overview.eyebrow,
                    disabled: readOnly,
                    onInput: bind("overview.eyebrow"),
                  }),
                  Field({
                    id: "overview-heading",
                    label: "Title",
                    value: item.overview.heading,
                    disabled: readOnly,
                    onInput: bind("overview.heading"),
                  }),
                  Field({
                    id: "overview-paragraphs",
                    label: "Paragraphs",
                    control: "textarea",
                    rows: 5,
                    value: item.overview.paragraphs,
                    hint: "One line = one paragraph.",
                    disabled: readOnly,
                    onInput: bind("overview.paragraphs"),
                  }),
                ],
              },

              { type: "h2", children: ["Discovery"] },
              TextImageBlockFields("discovery", item.discovery, media, readOnly, "Image", "image"),

              { type: "h2", children: ["Challenge"] },
              TextImageBlockFields(
                "challenge",
                item.challenge,
                media,
                readOnly,
                "Background image",
                "backgroundImage",
              ),

              { type: "h2", children: ["Outcome"] },
              TextImageBlockFields("outcome", item.outcome, media, readOnly, "Image", "image"),

              {
                type: "div",
                attributes: [["class", ["editor__hint"]]],
                children: [
                  {
                    type: "button",
                    attributes: [
                      ["type", "button"],
                      ["class", ["button", "button--primary"]],
                      ["disabled", readOnly || saving],
                    ],
                    events: [["click", save]],
                    children: [saving ? "Saving…" : isNew ? "Create project" : "Save"],
                  },
                  !isNew
                    ? {
                        type: "button",
                        attributes: [
                          ["type", "button"],
                          ["class", ["icon-button", "icon-button--danger"]],
                          ["disabled", readOnly || saving],
                        ],
                        events: [["click", removeProject]],
                        children: ["Delete this project"],
                      }
                    : null,
                ].filter(Boolean),
              },
            ].filter(Boolean),
          },
        ],
      },
    ].filter(Boolean),
  };
}
