const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

export function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatMonth(value) {
  if (!value) return "";
  const [year, month] = String(value).split("-");
  if (!month) return year ?? "";
  return `${MONTHS[Number(month) - 1] ?? ""} ${year}`.trim();
}

export function formatPeriod(start, end, current = false) {
  const from = formatMonth(start);
  const to = current ? "aujourd'hui" : formatMonth(end);
  if (!from) return to;
  if (!to) return from;
  return `${from} — ${to}`;
}

export function truncate(value, length = 160) {
  const text = String(value ?? "").trim();
  if (text.length <= length) return text;
  return `${text.slice(0, length - 1).trimEnd()}…`;
}

export function initials(value) {
  return String(value ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function paragraphs(value) {
  return String(value ?? "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function uniqueId(prefix = "local") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
