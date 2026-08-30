import client from "./abdoulaye-cms-client.js";
import { mediaUrl } from "./portfolio-service.js";
import { isPublic } from "../data/workflow.js";

const PROJECT_LIST_POPULATE = { cover: true };

export function toImage(media) {
  if (!media) return { url: "", alt: "" };
  return { url: mediaUrl(media), alt: media.alternativeText ?? "" };
}

export function toProjectCard(raw) {
  return {
    id: raw.id,
    slug: raw.slug ?? "",
    title: raw.title ?? "",
    statusBadge: raw.statusBadge ?? "",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    excerpt: raw.excerpt ?? "",
    periodLabel: raw.periodLabel ?? "",
    periodPlace: raw.periodPlace ?? "",
    cover: toImage(raw.cover),
  };
}

export async function fetchProfile() {
  const raw = await client.findOne("abdoulaye-profile", {});
  return {
    firstName: raw?.firstName ?? "",
    lastName: raw?.lastName ?? "",
    role: raw?.role ?? "",
    status: { label: raw?.statusLabel ?? "", active: Boolean(raw?.statusActive) },
    bioShort: raw?.bioShort ?? "",
    bioLong: raw?.bioLong ?? "",
    email: raw?.email ?? "",
    phone: raw?.phone ?? "",
    location: raw?.location ?? "",
    github: raw?.github ?? "",
    contactIntro: raw?.contactIntro ?? "",
  };
}

export async function fetchHomeData() {
  const [profile, home] = await Promise.all([
    fetchProfile(),
    client.findOne("abdoulaye-home", { populate: { stats: true, infoItems: true, skills: true, experience: true, education: true } }),
  ]);

  return {
    profile,
    terminal: {
      filename: home?.terminalFilename ?? "",
      lines: Array.isArray(home?.terminalLines) ? home.terminalLines : [],
    },
    stats: Array.isArray(home?.stats) ? home.stats : [],
    aboutIntro: home?.aboutIntro ?? "",
    infoItems: Array.isArray(home?.infoItems) ? home.infoItems : [],
    skills: Array.isArray(home?.skills) ? home.skills : [],
    techTags: Array.isArray(home?.techTags) ? home.techTags : [],
    languages: Array.isArray(home?.languages) ? home.languages : [],
    interests: Array.isArray(home?.interests) ? home.interests : [],
    experience: Array.isArray(home?.experience) ? home.experience : [],
    education: Array.isArray(home?.education) ? home.education : [],
  };
}

export async function fetchProjects() {
  const result = await client.find("abdoulaye-projects", {
    filters: { state: { $eq: "published" } },
    sort: "order:asc",
    populate: PROJECT_LIST_POPULATE,
    pagination: { pageSize: 100 },
  });
  return result.items.map(toProjectCard);
}

export async function fetchProjectDetail(slug) {
  if (!slug) throw new Error("Slug de projet manquant");

  const result = await client.find("abdoulaye-projects", {
    filters: { slug: { $eq: slug } },
    populate: { cover: true },
  });

  const project = result.items[0];
  if (!project || !isPublic(project.state)) throw new Error(`Projet "${slug}" introuvable`);

  return {
    slug: project.slug ?? "",
    title: project.title ?? "",
    statusBadge: project.statusBadge ?? "",
    tags: Array.isArray(project.tags) ? project.tags : [],
    cover: toImage(project.cover),
    description: project.description ?? "",
    stack: Array.isArray(project.stack) ? project.stack : [],
    periodLabel: project.periodLabel ?? "",
    periodPlace: project.periodPlace ?? "",
    repoUrl: project.repoUrl ?? "",
    demoUrl: project.demoUrl ?? "",
  };
}
