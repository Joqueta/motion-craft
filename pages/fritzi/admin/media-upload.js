import portfolioStore, { notify, recordAudit } from "../../../store/portfolio-store.js";
import { uploadMedia } from "../../../services/portfolio-service.js";

const MAX_SIZE = 10 * 1024 * 1024;

export function createMediaUploadHandler(onSelect) {
  return async (file, alt) => {
    if (file.size > MAX_SIZE) {
      notify("Fichier trop volumineux : 10 Mo maximum.", "warning");
      return;
    }

    portfolioStore.update({ fritziFormStatus: "uploading" });

    try {
      const media = await uploadMedia(file, alt);
      portfolioStore.update({ fritziMedia: [media, ...(portfolioStore.get("fritziMedia") ?? [])] });
      onSelect({ id: media.id, url: media.url });
      recordAudit("Uploaded media", media.name);
      notify("Image envoyée.", "success");
    } catch (error) {
      notify(`Envoi impossible : ${error.message}`, "error");
    } finally {
      portfolioStore.update({ fritziFormStatus: "ready" });
    }
  };
}
