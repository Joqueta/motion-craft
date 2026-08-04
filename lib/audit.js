const RETENTION_DAYS = 30;
const MAX_ENTRIES = 100;

export function pruneEntries(entries, now = Date.now()) {
  const limit = now - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  return entries.filter((entry) => entry.at >= limit).slice(0, MAX_ENTRIES);
}

export function appendEntry(entries, { action, target = "", author = "" }, now = Date.now()) {
  return pruneEntries([{ at: now, action, target, author }, ...entries], now);
}

export { RETENTION_DAYS, MAX_ENTRIES };
