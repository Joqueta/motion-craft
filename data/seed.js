export const EMPTY_PROFILE = {
  name: "",
  title: "",
  bio: "",
  email: "",
  phone: "",
  location: "",
  avatar: "",
  avatarAlt: "",
  seoDescription: "",
  links: [],
};

export const SKILL_CATEGORIES = [
  "Front-end",
  "Back-end",
  "Gestion de projet",
  "Design",
  "Outils",
];

export default {
  profile: {
    name: "Camille Duret",
    title: "Développeuse créative",
    bio: "Je conçois des expériences interactives où le mouvement raconte le produit.\n\nJ'aime transformer une idée statique en interface vivante, sans jamais sacrifier la clarté du message.",
    email: "camille.duret@email.com",
    phone: "",
    location: "Lyon, France",
    avatar: "",
    avatarAlt: "",
    seoDescription:
      "Portfolio de Camille Duret, développeuse créative : projets, expériences et compétences.",
    links: [
      { label: "GitHub", url: "https://github.com/" },
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
    ],
  },

  experiences: [
    {
      id: "seed-exp-1",
      role: "Développeuse créative",
      company: "Studio Halo",
      location: "Lyon",
      startDate: "2023-01",
      endDate: "",
      current: true,
      description: "Conception d'expériences interactives et de micro-animations pour des clients créatifs.",
    },
    {
      id: "seed-exp-2",
      role: "Intégratrice front-end",
      company: "Agence Volt",
      location: "Lyon",
      startDate: "2021-01",
      endDate: "2023-01",
      current: false,
      description: "Intégration d'interfaces responsives et animations au scroll pour des sites vitrines.",
    },
  ],

  projects: [
    {
      id: "seed-proj-1",
      slug: "aurora",
      title: "Aurora — expérience interactive",
      summary: "Micro-interactions au scroll et transitions de particules en Vanilla JS.",
      description:
        "Aurora est une expérience interactive pensée pour une navigation immersive : micro-interactions au scroll, transitions de particules et animations fluides, développées sans dépendance externe.",
      image: "",
      imageAlt: "",
      tags: ["Canvas", "GSAP"],
      url: "",
      repository: "",
      date: "2026-01",
      featured: true,
      state: "published",
    },
    {
      id: "seed-proj-2",
      slug: "studio-volt-identite",
      title: "Studio Volt — identité",
      summary: "Identité de marque et système d'animation pour un studio créatif.",
      description:
        "Déclinaison d'une identité de marque en interface web animée : système de motion design cohérent, du logo aux transitions de page.",
      image: "",
      imageAlt: "",
      tags: ["Branding", "Motion"],
      url: "",
      repository: "",
      date: "2025-09",
      featured: true,
      state: "published",
    },
  ],

  skills: [
    { id: "seed-skill-1", name: "Vanilla JS", category: "Front-end", level: 4 },
    { id: "seed-skill-2", name: "WebGL", category: "Front-end", level: 3 },
    { id: "seed-skill-3", name: "GSAP", category: "Front-end", level: 4 },
    { id: "seed-skill-4", name: "Motion design", category: "Design", level: 4 },
  ],

  media: [],
};
