import client from "./mathis-cms-client.js";
import { mediaUrl } from "./portfolio-service.js";
import { isPublic } from "../data/workflow.js";

const PROJECT_LIST_POPULATE = { cover: true };
const PROJECT_DETAIL_POPULATE = { cover: true, heroImage: true };

export function toImage(media) {
  if (!media) return { url: "", alt: "" };
  return { url: mediaUrl(media), alt: media.alternativeText ?? "" };
}

export function toProjectCard(raw) {
  return {
    id: raw.id,
    slug: raw.slug ?? "",
    title: raw.title ?? "",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    excerpt: raw.excerpt ?? "",
    cover: toImage(raw.cover),
  };
}

export async function fetchProfile() {
  const raw = await client.findOne("mathis-profile", {});
  return {
    firstName: raw?.firstName ?? "",
    lastName: raw?.lastName ?? "",
    role: raw?.role ?? "",
    status: { label: raw?.statusLabel ?? "", active: Boolean(raw?.statusActive) },
    bioShort: raw?.bioShort ?? "",
    bioLong: raw?.bioLong ?? "",
    heroPhoto: toImage(raw?.heroPhoto),
    email: raw?.email ?? "",
    github: raw?.github ?? "",
    linkedin: raw?.linkedin ?? "",
    skillsLanguages: Array.isArray(raw?.skillsLanguages) ? raw.skillsLanguages : [],
    skillsFrameworks: Array.isArray(raw?.skillsFrameworks) ? raw.skillsFrameworks : [],
    skillsTools: Array.isArray(raw?.skillsTools) ? raw.skillsTools : [],
    contactIntro: raw?.contactIntro ?? "",
  };
}

export async function fetchProjects() {
  const result = await client.find("mathis-projects", {
    filters: { state: { $eq: "published" } },
    sort: "order:asc",
    populate: PROJECT_LIST_POPULATE,
    pagination: { pageSize: 100 },
  });
  return result.items.map(toProjectCard);
}

export async function fetchHomeData() {
  const [profile, projects] = await Promise.all([fetchProfile(), fetchProjects()]);
  return { profile, projects };
}

export async function fetchProjectDetail(slug) {
  if (!slug) throw new Error("Slug de projet manquant");

  const result = await client.find("mathis-projects", {
    filters: { slug: { $eq: slug } },
    populate: PROJECT_DETAIL_POPULATE,
  });

  const project = result.items[0];
  if (!project || !isPublic(project.state)) throw new Error(`Projet "${slug}" introuvable`);

  return {
    slug: project.slug ?? "",
    title: project.title ?? "",
    tags: Array.isArray(project.tags) ? project.tags : [],
    cover: toImage(project.cover),
    heroImage: toImage(project.heroImage),
    role: project.role ?? "",
    year: project.year ?? "",
    language: project.language ?? "",
    duration: project.duration ?? "",
    description: project.description ?? "",
    context: project.context ?? "",
    collaborator: project.collaborator ?? "",
    linkLabel: project.linkLabel ?? "",
    linkUrl: project.linkUrl ?? "",
  };
}
