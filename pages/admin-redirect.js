import config from "../config.js";

export default function AdminRedirect() {
  window.location.href = `${config.cmsUrl}/admin`;
  return null;
}
