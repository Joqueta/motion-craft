import client from "./cms-client.js";
import { mediaUrl } from "./portfolio-service.js";
import { profileMock } from "../mocks/fritzi/profile-mock.js";
import { contactMock } from "../mocks/fritzi/content-mock.js";

const LOGO = profileMock.logo;
const FOOTER_LOGO = contactMock.logo;
const FOOTER_NAV = contactMock.nav;

const HOME_POPULATE = {
  aboutPortrait: true,
  offeringsImage: true,
  offerings: { populate: ["relatedWork"] },
};

const ABOUT_POPULATE = {
  heroPortrait: true,
  offerings: { populate: ["relatedWork"] },
};

const PROJECT_LIST_POPULATE = { cover: true };

const PROJECT_DETAIL_POPULATE = {
  cover: true,
  heroImage: true,
  meta: true,
  overview: true,
  discovery: { populate: ["image"] },
  challenge: { populate: ["backgroundImage"] },
  outcome: { populate: ["image"] },
};

export function toImage(media) {
  if (!media) return { url: "", alt: "" };
  return { url: mediaUrl(media), alt: media.alternativeText ?? "" };
}

export function toOffering(raw) {
  return {
    id: raw.id,
    number: raw.number ?? "",
    title: raw.title ?? "",
    tag: raw.tag ?? "",
    tools: raw.tools ?? "",
    work: Array.isArray(raw.work) ? raw.work : [],
    relatedWork: Array.isArray(raw.relatedWork)
      ? raw.relatedWork.map((item) => ({ label: item.label ?? "", slug: item.slug ?? "" }))
      : [],
  };
}

export function toProjectCard(raw) {
  return {
    id: raw.id,
    slug: raw.slug ?? "",
    client: raw.client ?? "",
    label: raw.label ?? "",
    cover: toImage(raw.cover),
  };
}

export function toTextImageBlock(raw) {
  return {
    eyebrow: raw?.eyebrow ?? "",
    heading: raw?.heading ?? "",
    paragraphs: Array.isArray(raw?.paragraphs) ? raw.paragraphs : [],
    image: toImage(raw?.image),
  };
}

function toSkillsContent(home) {
  return {
    eyebrow: home?.skillsEyebrow ?? "",
    line1: home?.skillsLine1 ?? "",
    connector: home?.skillsConnector ?? "",
    line2: home?.skillsLine2 ?? "",
    paragraphs: Array.isArray(home?.skillsParagraphs) ? home.skillsParagraphs : [],
    cvLabel: home?.cvLabel ?? "",
    offeringsImage: toImage(home?.offeringsImage),
  };
}

function toAboutMe(home) {
  return {
    heading: home?.aboutHeading ?? "",
    quote: {
      lead: home?.quoteLead ?? "",
      highlight1: home?.quoteHighlight1 ?? "",
      connector: home?.quoteConnector ?? "",
      highlight2: home?.quoteHighlight2 ?? "",
      tail: home?.quoteTail ?? "",
    },
    caption: home?.aboutCaption ?? "",
    portrait: toImage(home?.aboutPortrait),
  };
}

export async function fetchProfile() {
  const raw = await client.findOne("fritzi-profile", {});
  return {
    firstName: raw?.firstName ?? "",
    lastName: raw?.lastName ?? "",
    role: raw?.role ?? "",
    bio: raw?.bio ?? "",
    status: { label: raw?.statusLabel ?? "", active: Boolean(raw?.statusActive) },
    location: raw?.location ?? "",
    year: raw?.year ?? "",
    logo: LOGO,
  };
}

export async function fetchContactInfo() {
  const raw = await client.findOne("fritzi-profile", {});
  return {
    heading: Array.isArray(raw?.contactHeading) ? raw.contactHeading : [],
    logo: FOOTER_LOGO,
    nav: FOOTER_NAV,
    linkedin: raw?.linkedin ?? "",
    email: raw?.email ?? "",
    instagram: raw?.instagram ?? "",
  };
}

export async function fetchHomeData() {
  const [profile, home, featured] = await Promise.all([
    fetchProfile(),
    client.findOne("fritzi-home", { populate: HOME_POPULATE }),
    client.find("fritzi-projects", {
      filters: { featured: { $eq: true } },
      sort: "order:asc",
      populate: PROJECT_LIST_POPULATE,
      pagination: { pageSize: 100 },
    }),
  ]);

  return {
    profile,
    projects: featured.items.map(toProjectCard),
    about: toSkillsContent(home),
    aboutMe: toAboutMe(home),
    offerings: Array.isArray(home?.offerings) ? home.offerings.map(toOffering) : [],
  };
}

export async function fetchAboutData() {
  const [home, about] = await Promise.all([
    client.findOne("fritzi-home", { populate: { offeringsImage: true } }),
    client.findOne("fritzi-about", { populate: ABOUT_POPULATE }),
  ]);

  return {
    hero: {
      role: about?.heroRole ?? "",
      locationLabel: about?.heroLocationLabel ?? "",
      location: about?.heroLocation ?? "",
      portrait: toImage(about?.heroPortrait),
      paragraphs: Array.isArray(about?.heroParagraphs) ? about.heroParagraphs : [],
    },
    skillsContent: toSkillsContent(home),
    offerings: Array.isArray(about?.offerings) ? about.offerings.map(toOffering) : [],
  };
}

export async function fetchWorkData() {
  const result = await client.find("fritzi-projects", {
    sort: "order:asc",
    populate: PROJECT_LIST_POPULATE,
    pagination: { pageSize: 100 },
  });
  return result.items.map(toProjectCard);
}

export async function fetchContactData() {
  const contact = await client.findOne("fritzi-contact", { populate: { heroPortrait: true } });
  return { portrait: toImage(contact?.heroPortrait) };
}

export async function fetchProjectDetail(slug) {
  if (!slug) throw new Error("Slug de projet manquant");

  const [match, list] = await Promise.all([
    client.find("fritzi-projects", {
      filters: { slug: { $eq: slug } },
      populate: PROJECT_DETAIL_POPULATE,
    }),
    client.find("fritzi-projects", {
      sort: "order:asc",
      populate: PROJECT_LIST_POPULATE,
      pagination: { pageSize: 100 },
    }),
  ]);

  const project = match.items[0];
  if (!project) throw new Error(`Projet "${slug}" introuvable`);

  const ordered = list.items;
  const index = ordered.findIndex((item) => item.slug === slug);
  const next = ordered.length > 1 ? ordered[(index + 1) % ordered.length] : null;

  return {
    slug: project.slug ?? "",
    title: project.title ?? "",
    eyebrow: project.eyebrow ?? "",
    meta: Array.isArray(project.meta)
      ? project.meta.map((item) => ({ label: item.label ?? "", value: item.value ?? "" }))
      : [],
    heroImage: toImage(project.heroImage),
    overview: {
      sideLabel: project.overview?.sideLabel ?? "",
      eyebrow: project.overview?.eyebrow ?? "",
      heading: project.overview?.heading ?? "",
      paragraphs: Array.isArray(project.overview?.paragraphs) ? project.overview.paragraphs : [],
    },
    discovery: toTextImageBlock(project.discovery),
    challenge: {
      eyebrow: project.challenge?.eyebrow ?? "",
      heading: project.challenge?.heading ?? "",
      paragraphs: Array.isArray(project.challenge?.paragraphs) ? project.challenge.paragraphs : [],
      backgroundImage: toImage(project.challenge?.backgroundImage),
    },
    outcome: toTextImageBlock(project.outcome),
    nextProject: next
      ? {
          label: "Next project",
          title: next.title ?? "",
          slug: next.slug ?? "",
          client: next.client ?? "",
          tag: next.label ?? "",
          cover: toImage(next.cover),
        }
      : null,
  };
}
