import createStore from "../lib/store.js";
import { appendEntry, pruneEntries } from "../lib/audit.js";
import { applyTheme, currentTheme } from "../lib/theme.js";
import config from "../config.js";
import seed from "../data/seed.js";

const portfolioStore = createStore(
  {
    content: seed,
    source: "local",
    status: "idle",
    auth: "idle",
    notice: null,
    session: null,
    dirty: false,
    audit: [],
    consent: null,
    theme: "light",
  },
  { persist: config.storageKey, persistKeys: ["content", "audit", "consent"] },
);

portfolioStore.update({
  audit: pruneEntries(portfolioStore.get("audit") ?? []),
  theme: applyTheme(currentTheme()),
});

export function recordAudit(action, target = "") {
  const session = portfolioStore.get("session");
  portfolioStore.update({
    audit: appendEntry(portfolioStore.get("audit") ?? [], {
      action,
      target,
      author: session?.user?.username ?? "anonyme",
    }),
  });
}

export function clearAudit() {
  portfolioStore.update({ audit: [] });
}

export function notify(message, tone = "info") {
  portfolioStore.update({ notice: { message, tone, at: Date.now() } });
}

export function clearNotice() {
  portfolioStore.update({ notice: null });
}

export function setContent(content, source = "local") {
  portfolioStore.update({ content, source, dirty: false });
}

export function editContent(path, value) {
  portfolioStore.set(`content.${path}`, value);
  portfolioStore.update({ dirty: true });
}

export default portfolioStore;
