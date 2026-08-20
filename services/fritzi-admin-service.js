import client from "./cms-client.js";
import { mediaUrl, syncCollection } from "./portfolio-service.js";
import { STATE_VALUES } from "../data/workflow.js";

const LIST_QUERY = { sort: "order:asc", populate: { cover: true }, pagination: { pageSize: 100 } };

function toFritziProjectItem(entity) {
  return {
    id: entity.id,
    slug: entity.slug ?? "",
    client: entity.client ?? "",
    label: entity.label ?? "",
    cover: entity.cover ? { id: entity.cover.id, url: mediaUrl(entity.cover) } : null,
    featured: Boolean(entity.featured),
    order: Number(entity.order) || 0,
    state: STATE_VALUES.includes(entity.state) ? entity.state : "draft",
  };
}

export async function loadFritziProjects() {
  const result = await client.find("fritzi-projects", LIST_QUERY);
  return result.items.map(toFritziProjectItem);
}

export async function loadMediaLibrary() {
  const result = await client.find("upload/files", { pagination: { pageSize: 100 } });
  return result.items.map((file) => ({ id: file.id, name: file.name ?? "", url: mediaUrl(file) }));
}

function fromFritziProjectItem(item) {
  const data = {
    slug: item.slug,
    client: item.client,
    label: item.label,
    featured: item.featured,
    order: item.order,
    state: item.state,
  };
  if (item.cover?.id) data.cover = item.cover.id;
  return data;
}

export async function saveFritziProjects(items, previous) {
  return syncCollection("fritzi-projects", items, previous, fromFritziProjectItem);
}

const PROJECT_DETAIL_POPULATE = {
  cover: true,
  heroImage: true,
  meta: true,
  overview: true,
  discovery: { populate: ["image"] },
  challenge: { populate: ["backgroundImage"] },
  outcome: { populate: ["image"] },
};

export function toMediaRef(media) {
  return media ? { id: media.id, url: mediaUrl(media) } : null;
}

export function toParagraphsText(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function toTextImageBlockItem(raw) {
  return {
    eyebrow: raw?.eyebrow ?? "",
    heading: raw?.heading ?? "",
    paragraphs: toParagraphsText(raw?.paragraphs),
    image: toMediaRef(raw?.image),
  };
}

export function toProjectDetailItem(entity) {
  return {
    id: entity.id,
    documentId: entity.documentId ?? null,
    slug: entity.slug ?? "",
    client: entity.client ?? "",
    label: entity.label ?? "",
    cover: toMediaRef(entity.cover),
    featured: Boolean(entity.featured),
    order: Number(entity.order) || 0,
    state: STATE_VALUES.includes(entity.state) ? entity.state : "draft",
    title: entity.title ?? "",
    eyebrow: entity.eyebrow ?? "",
    heroImage: toMediaRef(entity.heroImage),
    meta: Array.isArray(entity.meta)
      ? entity.meta.map((item) => ({ label: item.label ?? "", value: item.value ?? "" }))
      : [],
    overview: {
      sideLabel: entity.overview?.sideLabel ?? "",
      eyebrow: entity.overview?.eyebrow ?? "",
      heading: entity.overview?.heading ?? "",
      paragraphs: toParagraphsText(entity.overview?.paragraphs),
    },
    discovery: toTextImageBlockItem(entity.discovery),
    challenge: {
      eyebrow: entity.challenge?.eyebrow ?? "",
      heading: entity.challenge?.heading ?? "",
      paragraphs: toParagraphsText(entity.challenge?.paragraphs),
      backgroundImage: toMediaRef(entity.challenge?.backgroundImage),
    },
    outcome: toTextImageBlockItem(entity.outcome),
  };
}

export async function loadFritziProjectDetail(slug) {
  const result = await client.find("fritzi-projects", {
    filters: { slug: { $eq: slug } },
    populate: PROJECT_DETAIL_POPULATE,
  });
  const entity = result.items[0];
  return entity ? toProjectDetailItem(entity) : null;
}

export function createEmptyProjectDetailItem() {
  return {
    id: null,
    documentId: null,
    slug: "",
    client: "",
    label: "",
    cover: null,
    featured: false,
    order: 0,
    state: "draft",
    title: "",
    eyebrow: "",
    heroImage: null,
    meta: [],
    overview: { sideLabel: "", eyebrow: "", heading: "", paragraphs: "" },
    discovery: { eyebrow: "", heading: "", paragraphs: "", image: null },
    challenge: { eyebrow: "", heading: "", paragraphs: "", backgroundImage: null },
    outcome: { eyebrow: "", heading: "", paragraphs: "", image: null },
  };
}

function componentHasContent(component, textKeys) {
  return textKeys.some((key) => String(component[key] ?? "").trim() !== "");
}

function fromProjectDetailItem(item) {
  const data = {
    slug: item.slug,
    client: item.client,
    label: item.label,
    featured: item.featured,
    order: item.order,
    state: item.state,
    title: item.title,
    eyebrow: item.eyebrow,
  };
  if (item.cover?.id) data.cover = item.cover.id;
  if (item.heroImage?.id) data.heroImage = item.heroImage.id;
  if (item.meta.length) data.meta = item.meta.map(({ label, value }) => ({ label, value }));

  if (componentHasContent(item.overview, ["sideLabel", "eyebrow", "heading", "paragraphs"])) {
    data.overview = {
      sideLabel: item.overview.sideLabel,
      eyebrow: item.overview.eyebrow,
      heading: item.overview.heading,
      paragraphs: item.overview.paragraphs
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };
  }

  for (const [key, imageKey] of [
    ["discovery", "image"],
    ["outcome", "image"],
    ["challenge", "backgroundImage"],
  ]) {
    const block = item[key];
    const hasImage = Boolean(block[imageKey]?.id);
    if (!componentHasContent(block, ["eyebrow", "heading", "paragraphs"]) && !hasImage) continue;
    data[key] = {
      eyebrow: block.eyebrow,
      heading: block.heading,
      paragraphs: block.paragraphs
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      ...(hasImage ? { [imageKey]: block[imageKey].id } : {}),
    };
  }

  return data;
}

export async function createFritziProject(item) {
  const created = await client.create("fritzi-projects", fromProjectDetailItem(item), { populate: PROJECT_DETAIL_POPULATE });
  return toProjectDetailItem(created);
}

export async function saveFritziProjectDetail(documentId, item) {
  const saved = await client.update(`fritzi-projects/${documentId}`, fromProjectDetailItem(item), { populate: PROJECT_DETAIL_POPULATE });
  return toProjectDetailItem(saved);
}

export async function deleteFritziProject(documentId) {
  await client.remove(`fritzi-projects/${documentId}`);
}

const PROJECT_REQUIRED_FIELDS = [
  { get: (item) => item.client, label: "Client", kind: "text" },
  { get: (item) => item.label, label: "Intitulé", kind: "text" },
  { get: (item) => item.title, label: "Titre", kind: "text" },
  { get: (item) => item.eyebrow, label: "Eyebrow", kind: "text" },
  { get: (item) => item.cover, label: "Image de couverture", kind: "media" },
  { get: (item) => item.heroImage, label: "Image principale", kind: "media" },
  // discovery/challenge/outcome images are required by the Strapi schema as soon as
  // the corresponding component is sent (i.e. as soon as any of its text is filled in).
  { get: (item) => item.discovery.image, label: "Image de découverte", kind: "media" },
  { get: (item) => item.challenge.backgroundImage, label: "Image du défi", kind: "media" },
  { get: (item) => item.outcome.image, label: "Image du résultat", kind: "media" },
];

export function missingProjectFields(item) {
  return PROJECT_REQUIRED_FIELDS.filter(({ get, kind }) =>
    kind === "media" ? !get(item)?.id : String(get(item) ?? "").trim() === "",
  ).map(({ label }) => label);
}

const PAGE_RESOURCES = {
  home: "fritzi-home",
  about: "fritzi-about",
  contact: "fritzi-contact",
  profil: "fritzi-profile",
};

const PAGE_POPULATE = {
  home: { aboutPortrait: true, offeringsImage: true, offerings: { populate: ["relatedWork"] } },
  about: { heroPortrait: true, offerings: { populate: ["relatedWork"] } },
  contact: { heroPortrait: true },
  profil: {},
};

function toOfferingItem(raw) {
  return {
    number: raw.number ?? "",
    title: raw.title ?? "",
    tag: raw.tag ?? "",
    tools: raw.tools ?? "",
    work: toParagraphsText(raw.work),
    relatedWork: Array.isArray(raw.relatedWork)
      ? raw.relatedWork.map((item) => ({ label: item.label ?? "", slug: item.slug ?? "" }))
      : [],
  };
}

function fromOfferingItem(offering) {
  return {
    number: offering.number,
    title: offering.title,
    tag: offering.tag,
    tools: offering.tools,
    work: offering.work
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    relatedWork: offering.relatedWork.map(({ label, slug }) => ({ label, slug })),
  };
}

const PAGE_MAPPERS = {
  home: {
    to: (raw) => ({
      aboutHeading: raw.aboutHeading ?? "",
      quoteLead: raw.quoteLead ?? "",
      quoteHighlight1: raw.quoteHighlight1 ?? "",
      quoteConnector: raw.quoteConnector ?? "",
      quoteHighlight2: raw.quoteHighlight2 ?? "",
      quoteTail: raw.quoteTail ?? "",
      aboutCaption: raw.aboutCaption ?? "",
      aboutPortrait: toMediaRef(raw.aboutPortrait),
      skillsEyebrow: raw.skillsEyebrow ?? "",
      skillsLine1: raw.skillsLine1 ?? "",
      skillsConnector: raw.skillsConnector ?? "",
      skillsLine2: raw.skillsLine2 ?? "",
      skillsParagraphs: toParagraphsText(raw.skillsParagraphs),
      cvLabel: raw.cvLabel ?? "",
      offeringsImage: toMediaRef(raw.offeringsImage),
      offerings: Array.isArray(raw.offerings) ? raw.offerings.map(toOfferingItem) : [],
    }),
    from: (data) => ({
      aboutHeading: data.aboutHeading,
      quoteLead: data.quoteLead,
      quoteHighlight1: data.quoteHighlight1,
      quoteConnector: data.quoteConnector,
      quoteHighlight2: data.quoteHighlight2,
      quoteTail: data.quoteTail,
      aboutCaption: data.aboutCaption,
      ...(data.aboutPortrait?.id ? { aboutPortrait: data.aboutPortrait.id } : {}),
      skillsEyebrow: data.skillsEyebrow,
      skillsLine1: data.skillsLine1,
      skillsConnector: data.skillsConnector,
      skillsLine2: data.skillsLine2,
      skillsParagraphs: data.skillsParagraphs
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      cvLabel: data.cvLabel,
      ...(data.offeringsImage?.id ? { offeringsImage: data.offeringsImage.id } : {}),
      offerings: data.offerings.map(fromOfferingItem),
    }),
  },
  about: {
    to: (raw) => ({
      heroRole: raw.heroRole ?? "",
      heroLocationLabel: raw.heroLocationLabel ?? "",
      heroLocation: raw.heroLocation ?? "",
      heroPortrait: toMediaRef(raw.heroPortrait),
      heroParagraphs: toParagraphsText(raw.heroParagraphs),
      offerings: Array.isArray(raw.offerings) ? raw.offerings.map(toOfferingItem) : [],
    }),
    from: (data) => ({
      heroRole: data.heroRole,
      heroLocationLabel: data.heroLocationLabel,
      heroLocation: data.heroLocation,
      ...(data.heroPortrait?.id ? { heroPortrait: data.heroPortrait.id } : {}),
      heroParagraphs: data.heroParagraphs
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      offerings: data.offerings.map(fromOfferingItem),
    }),
  },
  contact: {
    to: (raw) => ({ heroPortrait: toMediaRef(raw.heroPortrait) }),
    from: (data) => (data.heroPortrait?.id ? { heroPortrait: data.heroPortrait.id } : {}),
  },
  profil: {
    to: (raw) => ({
      firstName: raw.firstName ?? "",
      lastName: raw.lastName ?? "",
      role: raw.role ?? "",
      bio: raw.bio ?? "",
      statusLabel: raw.statusLabel ?? "",
      statusActive: Boolean(raw.statusActive),
      location: raw.location ?? "",
      year: raw.year ?? "",
      email: raw.email ?? "",
      linkedin: raw.linkedin ?? "",
      instagram: raw.instagram ?? "",
      contactHeading: toParagraphsText(raw.contactHeading),
    }),
    from: (data) => ({
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      bio: data.bio,
      statusLabel: data.statusLabel,
      statusActive: data.statusActive,
      location: data.location,
      year: data.year,
      email: data.email,
      linkedin: data.linkedin,
      instagram: data.instagram,
      contactHeading: data.contactHeading
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    }),
  },
};

export async function loadFritziPage(page) {
  const raw = await client.findOne(PAGE_RESOURCES[page], { populate: PAGE_POPULATE[page] });
  return PAGE_MAPPERS[page].to(raw ?? {});
}

export async function saveFritziPage(page, data) {
  const saved = await client.update(PAGE_RESOURCES[page], PAGE_MAPPERS[page].from(data), { populate: PAGE_POPULATE[page] });
  return PAGE_MAPPERS[page].to(saved);
}

const PAGE_REQUIRED_FIELDS = {
  home: [
    { key: "aboutHeading", label: "Titre « À propos »", kind: "text" },
    { key: "quoteLead", label: "Citation — début", kind: "text" },
    { key: "quoteHighlight1", label: "Citation — mise en avant 1", kind: "text" },
    { key: "quoteConnector", label: "Citation — connecteur", kind: "text" },
    { key: "quoteHighlight2", label: "Citation — mise en avant 2", kind: "text" },
    { key: "quoteTail", label: "Citation — fin", kind: "text" },
    { key: "aboutCaption", label: "Légende du portrait", kind: "text" },
    { key: "aboutPortrait", label: "Portrait", kind: "media" },
    { key: "skillsEyebrow", label: "Eyebrow compétences", kind: "text" },
    { key: "skillsLine1", label: "Titre compétences — ligne 1", kind: "text" },
    { key: "skillsConnector", label: "Titre compétences — connecteur", kind: "text" },
    { key: "skillsLine2", label: "Titre compétences — ligne 2", kind: "text" },
    { key: "skillsParagraphs", label: "Paragraphes compétences", kind: "text" },
    { key: "cvLabel", label: "Libellé du bouton CV", kind: "text" },
    { key: "offeringsImage", label: "Image des offres", kind: "media" },
  ],
  about: [
    { key: "heroRole", label: "Rôle (hero)", kind: "text" },
    { key: "heroLocationLabel", label: "Libellé localisation", kind: "text" },
    { key: "heroLocation", label: "Localisation", kind: "text" },
    { key: "heroPortrait", label: "Portrait (hero)", kind: "media" },
    { key: "heroParagraphs", label: "Paragraphes (hero)", kind: "text" },
  ],
  contact: [{ key: "heroPortrait", label: "Portrait (hero)", kind: "media" }],
  profil: [
    { key: "firstName", label: "Prénom", kind: "text" },
    { key: "lastName", label: "Nom", kind: "text" },
    { key: "role", label: "Rôle", kind: "text" },
    { key: "bio", label: "Bio", kind: "text" },
    { key: "email", label: "Email", kind: "text" },
  ],
};

export function missingPageFields(page, data) {
  return PAGE_REQUIRED_FIELDS[page]
    .filter(({ key, kind }) => (kind === "media" ? !data[key]?.id : String(data[key] ?? "").trim() === ""))
    .map(({ label }) => label);
}
