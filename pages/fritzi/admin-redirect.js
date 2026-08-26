import config from "../../config.js";

const PAGE_CONTENT_TYPES = {
  home: "fritzi-home",
  about: "fritzi-about",
  contact: "fritzi-contact",
  profil: "fritzi-profile",
};

function goTo(url) {
  window.location.href = url;
}

export function FritziAdminEntryRedirect() {
  goTo(`${config.cmsUrl}/admin`);
  return null;
}

export function FritziAdminPageRedirect({ params }) {
  const type = PAGE_CONTENT_TYPES[params?.page];
  goTo(type ? `${config.cmsUrl}/admin/content-manager/single-types/api::${type}.${type}` : `${config.cmsUrl}/admin`);
  return null;
}

export function FritziAdminProjectsRedirect() {
  goTo(`${config.cmsUrl}/admin/content-manager/collection-types/api::fritzi-project.fritzi-project`);
  return null;
}
