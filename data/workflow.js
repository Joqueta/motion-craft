export const STATES = [
  { value: "draft", label: "Brouillon", public: false },
  { value: "review", label: "Prêt à relire", public: false },
  { value: "published", label: "Publié", public: true },
  { value: "archived", label: "Archivé", public: false },
];

export const STATE_VALUES = STATES.map((state) => state.value);

export function stateLabel(value) {
  return STATES.find((state) => state.value === value)?.label ?? "Brouillon";
}

export function isPublic(value) {
  return STATES.find((state) => state.value === value)?.public === true;
}

export function publicProjects(projects) {
  return projects.filter((project) => isPublic(project.state));
}
