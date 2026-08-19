import client from "./cms-client.js";
import seed, { EMPTY_PROFILE } from "../data/seed.js";
import { STATE_VALUES } from "../data/workflow.js";
import { slugify, uniqueId } from "../lib/text.js";

const LIST_QUERY = { pagination: { pageSize: 100 }, publicationState: "preview" };

function isRemote(id) {
  return typeof id === "number" || /^\d+$/.test(String(id ?? ""));
}

export function mediaUrl(media) {
  if (!media) return "";
  if (typeof media === "string") return media;
  const url = media.url ?? media.data?.attributes?.url ?? "";
  if (!url) return "";
  return url.startsWith("http") ? url : `${client.baseUrl}${url}`;
}

function toProfile(entity) {
  if (!entity) return { ...EMPTY_PROFILE };
  return {
    ...EMPTY_PROFILE,
    ...entity,
    avatar: mediaUrl(entity.avatar),
    avatarAlt: entity.avatarAlt ?? entity.avatar?.alternativeText ?? "",
    links: Array.isArray(entity.links) ? entity.links : [],
  };
}

function toMedia(entity) {
  return {
    id: entity.id,
    name: entity.name ?? "",
    url: mediaUrl(entity),
    alt: entity.alternativeText ?? "",
    width: entity.width ?? 0,
    height: entity.height ?? 0,
  };
}

function toExperience(entity) {
  return {
    id: entity.id,
    role: entity.role ?? "",
    company: entity.company ?? "",
    location: entity.location ?? "",
    startDate: entity.startDate ?? "",
    endDate: entity.endDate ?? "",
    current: Boolean(entity.current),
    description: entity.description ?? "",
  };
}

function toProject(entity) {
  return {
    id: entity.id,
    slug: entity.slug || slugify(entity.title ?? ""),
    title: entity.title ?? "",
    summary: entity.summary ?? "",
    description: entity.description ?? "",
    image: mediaUrl(entity.image),
    imageAlt: entity.imageAlt ?? entity.image?.alternativeText ?? "",
    tags: Array.isArray(entity.tags) ? entity.tags : [],
    url: entity.url ?? "",
    repository: entity.repository ?? "",
    date: entity.date ?? "",
    featured: Boolean(entity.featured),
    state: STATE_VALUES.includes(entity.state)
      ? entity.state
      : entity.publishedAt
        ? "published"
        : "draft",
  };
}

function toSkill(entity) {
  return {
    id: entity.id,
    name: entity.name ?? "",
    category: entity.category ?? "Outils",
    level: Number(entity.level) || 3,
  };
}

function fromProfile(profile) {
  return {
    name: profile.name,
    title: profile.title,
    bio: profile.bio,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    seoDescription: profile.seoDescription,
    links: profile.links,
  };
}

function fromExperience(experience) {
  const { id, ...fields } = experience;
  return { ...fields, endDate: fields.current ? null : fields.endDate || null };
}

function fromProject(project) {
  const { id, state, ...fields } = project;
  return {
    ...fields,
    state,
    slug: fields.slug || slugify(fields.title),
    publishedAt: state === "published" ? new Date().toISOString() : null,
  };
}

function fromSkill(skill) {
  const { id, ...fields } = skill;
  return fields;
}

export async function loadFromCms() {
  const [profile, experiences, projects, skills, media] = await Promise.all([
    client.findOne("profile", { populate: "*" }),
    client.find("experiences", { ...LIST_QUERY, sort: "startDate:desc" }),
    client.find("projects", { ...LIST_QUERY, populate: "*", sort: "date:desc" }),
    client.find("skills", { ...LIST_QUERY, sort: "name:asc" }),
    client.find("upload/files", { pagination: { pageSize: 100 } }).catch(() => ({ items: [] })),
  ]);

  return {
    profile: toProfile(profile),
    experiences: experiences.items.map(toExperience),
    projects: projects.items.map(toProject),
    skills: skills.items.map(toSkill),
    media: (media.items ?? []).map(toMedia),
  };
}

export async function uploadMedia(file, alt) {
  const uploaded = await client.upload(file, { alt });
  return toMedia(uploaded);
}

export async function deleteMedia(id) {
  await client.remove(`upload/files/${id}`);
}

async function syncCollection(resource, items, previousItems = [], serialize) {
  const keptIds = new Set(items.map((item) => String(item.id)));
  const removed = previousItems.filter((item) => isRemote(item.id) && !keptIds.has(String(item.id)));

  await Promise.all(removed.map((item) => client.remove(`${resource}/${item.id}`)));

  return Promise.all(
    items.map(async (item) => {
      const data = serialize(item);
      const saved = isRemote(item.id)
        ? await client.update(`${resource}/${item.id}`, data)
        : await client.create(resource, data);
      return { ...item, id: saved?.id ?? item.id };
    }),
  );
}

export async function saveToCms(content, previous) {
  await client.update("profile", fromProfile(content.profile));

  const [experiences, projects, skills] = await Promise.all([
    syncCollection("experiences", content.experiences, previous.experiences, fromExperience),
    syncCollection("projects", content.projects, previous.projects, fromProject),
    syncCollection("skills", content.skills, previous.skills, fromSkill),
  ]);

  return { profile: content.profile, experiences, projects, skills, media: content.media ?? [] };
}

export function createEmptyExperience() {
  return {
    id: uniqueId("exp"),
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

export function createEmptyProject() {
  return {
    id: uniqueId("proj"),
    slug: "",
    title: "",
    summary: "",
    description: "",
    image: "",
    imageAlt: "",
    tags: [],
    url: "",
    repository: "",
    date: "",
    featured: false,
    state: "draft",
  };
}

export function createEmptySkill() {
  return { id: uniqueId("skill"), name: "", category: "Front-end", level: 3 };
}

export function fallbackContent() {
  return structuredClone(seed);
}
