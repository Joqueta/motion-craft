'use strict';

const ABDOULAYE_SEED = {
  'api::abdoulaye-profile.abdoulaye-profile': {
    text: {
      firstName: 'Abdoulaye',
      lastName: 'Diagne',
      role: 'Développeur Web',
      statusLabel: 'disponible pour une alternance, 2026',
      statusActive: true,
      bioShort:
        "Étudiant en 3e année de Bachelor Développement Web à l'école Decode (Paris 11e), rigoureux et passionné par le code, je cherche une alternance pour mettre mes compétences techniques au service de projets concrets.",
      bioLong:
        "Admis en 3e année de Bachelor Informatique et futur M1 au sein de l'école Decode (Paris 11e), je suis passionné par le développement web sous toutes ses formes. Rigoureux et persévérant, je souhaite mettre mes compétences techniques et mon esprit logique au service de votre entreprise.",
      email: 'abdoulayediagne049@gmail.com',
      phone: '06 03 03 39 48',
      location: '2 rue Gaston Landry, 93700 Drancy',
      github: 'github.com/abdoulayediagne-lab',
      contactIntro: "Disponible pour une alternance à partir de 2026. N'hésitez pas à me contacter !",
    },
    media: {},
  },

  'api::abdoulaye-home.abdoulaye-home': {
    text: {
      terminalFilename: 'developer.json',
      terminalLines: [
        '{',
        '  "nom": "Abdoulaye Diagne",',
        '  "poste": "Développeur Web",',
        '  "stack": ["JS","PHP","React","Python"],',
        '  "ecole": "Decode, Paris 11e",',
        '  "langues": { "fr": "C2", "en": "B2" }',
        '}',
      ],
      stats: [
        { value: '4+', label: 'PROJETS' },
        { value: '8+', label: 'LANGAGES' },
        { value: '3e', label: 'ANNÉE BACHELOR' },
        { value: 'B2', label: 'ANGLAIS' },
      ],
      aboutIntro:
        "Admis en 3e année de Bachelor Informatique et futur M1 au sein de l'école Decode (Paris 11e), je suis passionné par le développement web sous toutes ses formes. Rigoureux et persévérant, je souhaite mettre mes compétences techniques et mon esprit logique au service de votre entreprise.",
      infoItems: [
        { label: 'FORMATION', value: 'Bachelor Dev Web – Decode' },
        { label: 'LOCALISATION', value: 'Drancy, Île-de-France' },
        { label: 'DISPONIBILITÉ', value: 'Alternance 2026' },
        { label: 'EMAIL', value: 'abdoulayediagne049@gmail.com' },
      ],
      skills: [
        { label: 'HTML5 / CSS3 / SASS', percent: 90 },
        { label: 'Python', percent: 85 },
        { label: 'JavaScript / Angular', percent: 80 },
        { label: 'SQL / PostgreSQL', percent: 75 },
        { label: 'PHP', percent: 70 },
      ],
      techTags: [
        'React',
        'Angular',
        'Docker',
        'Git / GitHub',
        'WordPress',
        'Linux',
        'Figma',
        'Power BI',
        'Dataiku',
        'Agile / SCRUM',
        'JWT',
        'REST API',
      ],
      languages: ['Français — Natif C2', 'Anglais — Intermédiaire B2'],
      interests: ['Accordéon (14 ans au conservatoire)', 'Football', 'Judo', 'Animation japonaise'],
      experience: [
        {
          period: 'Fev. 2026 – Actuellement',
          title: 'Développeur WordPress',
          place: 'MKS Tatoun · Frépillon',
          description: 'Création de sites web professionnels, optimisation SEO et intégration WooCommerce.',
        },
        {
          period: 'Jan. 2026 – Mars 2026',
          title: 'Projet CMS Headless – Wiki',
          place: 'École Decode · Paris 11e',
          description: 'CMS headless PHP avec framework maison, ORM PostgreSQL 18, auth JWT, RBAC.',
        },
        {
          period: 'Sept. 2023 – Fev. 2024',
          title: 'Projet informatique – Jeu Mario',
          place: 'UPEC · Créteil',
          description: 'Jeu de plateforme Mario en OCaml sur 6 mois.',
        },
        {
          period: 'Dec. 2021 – Jan. 2022',
          title: 'Développeur Python',
          place: 'Sciences Ouvertes Drancy',
          description: 'Jeu du serpent et flocon de Koch en Python.',
        },
      ],
      education: [
        { period: '2026 – 2028', title: 'Mastère Data / IA', place: 'École Decode · Paris 11e' },
        { period: '2025 – 2026', title: 'Bachelor Développement Web', place: 'École Decode · Paris 11e' },
        { period: '2021 – 2025', title: 'Licence de Mathématiques', place: 'UPEC · Créteil' },
        { period: '2021', title: 'Baccalauréat', place: 'Lycée Charles Péguy · Paris 11e' },
      ],
    },
    media: {},
  },
};

const ABDOULAYE_PROJECTS = [
  {
    text: {
      state: 'published',
      slug: 'cms-headless-wiki',
      title: 'CMS Headless — Wiki',
      statusBadge: 'Projet École — Decode Paris',
      tags: ['CSS', 'PostgreSQL', 'SCRUM', 'GitHub Projects'],
      excerpt:
        'Backoffice CMS headless en PHP avec framework maison, ORM PostgreSQL, authentification JWT et permissions RBAC.',
      description:
        "Développement d'un CMS headless en PHP avec framework maison. ORM léger pour PostgreSQL, authentification JWT, gestion de contenus avec contrôle d'accès par rôles. Gestion de projet en SCRUM via GitHub Projects.",
      stack: ['PHP', 'PostgreSQL 18 — ORM léger', 'GitHub Projects — SCRUM', 'Docker', 'SCSS'],
      periodLabel: 'Janvier 2026 — Mars 2026',
      periodPlace: 'École Decode, Paris',
      repoUrl: 'https://github.com/abdoulayediagne-lab',
      demoUrl: 'https://github.com/abdoulayediagne-lab',
      order: 0,
      featured: true,
    },
    media: { cover: { asset: 'abdoulaye-default-cover.svg', alt: 'Aperçu du projet CMS Headless — Wiki' } },
  },
  {
    text: {
      state: 'published',
      slug: 'jeu-harry-potter',
      title: 'Jeu Harry Potter',
      statusBadge: 'Projet personnel',
      tags: ['Javascript', 'HTML', 'CSS'],
      excerpt: "Jeu de devinette quotidien façon Wordle sur l'univers Harry Potter, développé en JavaScript vanilla avec indices visuels.",
      description:
        "Jeu de devinettes interactif inspiré de l'univers Harry Potter. L'objectif est de retrouver un personnage mystère en soumettant des propositions. Chaque tentative révèle des indices visuels : vert si la propriété correspond (maison, objet magique, taille...), rouge sinon. Développé principalement en JavaScript avec une logique de comparaison dynamique.",
      stack: ['Javascript', 'HTML', 'CSS'],
      periodLabel: 'Décembre 2025 — Janvier 2026',
      periodPlace: 'Paris',
      repoUrl: 'https://github.com/abdoulayediagne-lab',
      demoUrl: 'https://github.com/abdoulayediagne-lab',
      order: 1,
      featured: false,
    },
    media: { cover: { asset: 'abdoulaye-default-cover.svg', alt: 'Aperçu du jeu Harry Potter' } },
  },
  {
    text: {
      state: 'published',
      slug: 'simulateur-bayesien',
      title: 'Simulateur bayésien',
      statusBadge: 'Projet École — Decode Paris',
      tags: ['Maths', 'HTML/CSS'],
      excerpt: 'Simulateur pédagogique du théorème de Bayes : animation de probabilités conditionnelles en temps réel.',
      description:
        "Simulateur pédagogique illustrant le théorème de Bayes appliqué à des cas concrets (tests médicaux, probabilités conditionnelles). Réalisé en binôme dans le cadre du module mathématiques appliquées, l'outil permet de faire varier les paramètres (prévalence, sensibilité, spécificité) et visualise en temps réel l'impact sur la probabilité a posteriori.",
      stack: ['Javascript', 'Maths', 'HTML/CSS'],
      periodLabel: 'Mars 2026 — Mai 2026',
      periodPlace: 'École Decode, Paris',
      repoUrl: 'https://github.com/abdoulayediagne-lab',
      demoUrl: 'https://github.com/abdoulayediagne-lab',
      order: 2,
      featured: false,
    },
    media: { cover: { asset: 'abdoulaye-default-cover.svg', alt: 'Aperçu du simulateur bayésien' } },
  },
  {
    text: {
      state: 'published',
      slug: 'site-ekipma',
      title: 'Site Ekipma',
      statusBadge: 'Projet Stage — MKS Tatoun',
      tags: ['Wordpress', 'PHP', 'SEO', 'CSS'],
      excerpt: "Site vitrine WordPress pour une entreprise de services et d'équipements, avec optimisation SEO.",
      description:
        "Site vitrine WordPress développé durant le stage chez MKS Tatoun, pour la marque Ekipma. Travail sur le thème (structure PHP, templates), l'intégration CSS responsive et l'optimisation SEO on-page (balises, structure sémantique, performance) afin d'améliorer la visibilité du site sur les moteurs de recherche.",
      stack: ['Wordpress', 'PHP', 'SEO', 'CSS'],
      periodLabel: 'Janvier 2026 — Mars 2026',
      periodPlace: 'MKS Tatoun',
      repoUrl: 'https://github.com/abdoulayediagne-lab',
      demoUrl: 'https://europakimache.fr/',
      order: 3,
      featured: false,
    },
    media: { cover: { asset: 'abdoulaye-default-cover.svg', alt: 'Aperçu du site Ekipma' } },
  },
];

module.exports = { ABDOULAYE_SEED, ABDOULAYE_PROJECTS };
