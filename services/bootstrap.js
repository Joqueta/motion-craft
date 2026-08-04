import portfolioStore, { notify, recordAudit, setContent } from "../store/portfolio-store.js";
import { loadFromCms, saveToCms } from "./portfolio-service.js";
import { restoreSession } from "./auth-service.js";

let remoteSnapshot = { profile: {}, experiences: [], projects: [], skills: [] };

export async function refreshContent({ silent = false } = {}) {
  portfolioStore.update({ status: "loading" });

  try {
    const content = await loadFromCms();
    remoteSnapshot = content;
    setContent(content, "cms");
    portfolioStore.update({ status: "ready" });
    if (!silent) notify("Contenus chargés depuis le CMS.", "success");
    return content;
  } catch (error) {
    portfolioStore.update({ status: "ready", source: "local" });
    if (!silent) notify(`${error.message} Les contenus locaux sont affichés.`, "warning");
    return portfolioStore.get("content");
  }
}

export async function publishContent() {
  const content = portfolioStore.get("content");
  portfolioStore.update({ status: "saving" });

  try {
    const saved = await saveToCms(content, remoteSnapshot);
    remoteSnapshot = saved;
    setContent(saved, "cms");
    portfolioStore.update({ status: "ready" });
    recordAudit("Publication vers le CMS");
    notify("Contenus enregistrés dans le CMS.", "success");
    return saved;
  } catch (error) {
    portfolioStore.update({ status: "ready" });
    notify(`Échec de l'enregistrement : ${error.message}`, "error");
    throw error;
  }
}

export default function bootstrap() {
  restoreSession();
  refreshContent({ silent: true });
}
