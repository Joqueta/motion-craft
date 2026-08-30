import config from "../../config.js";

function goTo(url) {
  window.location.href = url;
}

export function MathisAdminEntryRedirect() {
  goTo(`${config.cmsUrl}/admin`);
  return null;
}

export function MathisAdminProfileRedirect() {
  goTo(`${config.cmsUrl}/admin/content-manager/single-types/api::mathis-profile.mathis-profile`);
  return null;
}

export function MathisAdminProjectsRedirect() {
  goTo(`${config.cmsUrl}/admin/content-manager/collection-types/api::mathis-project.mathis-project`);
  return null;
}
