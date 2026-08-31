'use strict';

const RETENTION_DAYS = 30;
const MAX_ENTRIES = 100;

function computeIdsToDelete(entries, now = Date.now()) {
  const cutoff = now - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const sorted = [...entries].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  const idsToDelete = [];
  sorted.forEach((entry, index) => {
    const isExpired = new Date(entry.at).getTime() < cutoff;
    const isOverflow = index >= MAX_ENTRIES;
    if (isExpired || isOverflow) idsToDelete.push(entry.id);
  });
  return idsToDelete;
}

module.exports = { computeIdsToDelete, RETENTION_DAYS, MAX_ENTRIES };
