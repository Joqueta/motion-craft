import config from "../../config.js";

const PAGE_CONTENT_TYPES = {
  profil: "abdoulaye-profile",
  home: "abdoulaye-home",
};

function goTo(url) {
  window.location.href = url;
}

export function AbdoulayeAdminEntryRedirect() {
  goTo(`${config.cmsUrl}/admin`);
  return null;
}

export function AbdoulayeAdminPageRedirect({ params }) {
  const type = PAGE_CONTENT_TYPES[params?.page];
  goTo(type ? `${config.cmsUrl}/admin/content-manager/single-types/api::${type}.${type}` : `${config.cmsUrl}/admin`);
  return null;
}

export function AbdoulayeAdminProjectsRedirect() {
  goTo(`${config.cmsUrl}/admin/content-manager/collection-types/api::abdoulaye-project.abdoulaye-project`);
  return null;
}
