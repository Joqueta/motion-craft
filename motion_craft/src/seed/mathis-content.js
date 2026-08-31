'use strict';

const MATHIS_SEED = {
  'api::mathis-profile.mathis-profile': {
    text: {
      firstName: 'Mathis',
      lastName: 'Vidueira',
      role: 'Développeur web en alternance',
      statusLabel: 'alternant chez Phoenix Performance',
      statusActive: true,
      bioShort:
        'Étudiant en 3ème année de Bachelor Développement Web chez decode et alternant chez Phoenix Performance en tant que Chef de projet IA.',
      bioLong:
        'Après avoir obtenu un Bac Général mention bien en 2022 et un BTS SIO SLAM en 2024, je suis actuellement étudiant en 3ème année de Bachelor Développement Web chez decode.',
      email: 'vidueiramathis@gmail.com',
      github: 'https://github.com/siomathisa',
      linkedin: 'https://www.linkedin.com/in/mathis-vidueira/',
      skillsLanguages: ['HTML / CSS', 'Javascript', 'PHP', 'Python'],
      skillsFrameworks: ['Tailwind', 'React', 'Laravel'],
      skillsTools: ['Git / GitHub', 'VS Code', 'Docker', 'n8n'],
      contactIntro: 'Contactez-moi via ce formulaire si mon profil vous intéresse ou simplement pour discuter.',
    },
    media: {
      heroPhoto: { asset: 'ma photo.jpeg', alt: 'Photo de Mathis Vidueira' },
    },
  },
};

const MATHIS_PROJECTS = [
  {
    text: {
      state: 'published',
      slug: 'wiki-cms-headless',
      title: 'Wiki - CMS Headless',
      tags: ['PHP', 'PostgreSQL', 'SCSS'],
      excerpt:
        'CMS headless développé from scratch en PHP (framework maison), avec API backend (PHP + Apache), base PostgreSQL 18, front public statique, backoffice statique et compilation SCSS en continu.',
      role: 'Développeur / SCRUM Master',
      year: '2026',
      language: 'PHP',
      duration: '2 mois',
      description:
        "Le projet est une plateforme de documentation/wiki d'entreprise. Il permet aux équipes éditoriales de centraliser, rédiger et publier des guides ou articles structurés pour leurs collaborateurs.",
      context: 'Projet semestriel (1er semestre) du Bachelor 3 Développement Web chez decode.',
      collaborator: 'Abdoulaye DIAGNE',
      linkLabel: 'Repo github du projet',
      linkUrl: 'https://github.com/siomathisa/3ADW_projet-semestriel-cms',
      order: 0,
    },
    media: {
      cover: { asset: 'card projet cms.png', alt: 'Aperçu du projet Wiki - CMS Headless' },
      heroImage: { asset: 'page projet cms.png', alt: 'Capture du projet Wiki - CMS Headless' },
    },
  },
  {
    text: {
      state: 'published',
      slug: 'metro-parisien-algorithme-a',
      title: 'Métro parisien - Algorithme A*',
      tags: ['Python', 'Algorithmie avancée'],
      excerpt:
        "Ce projet implémente un algorithme A* pour trouver le chemin le plus court entre deux stations du métro parisien. Il prend en compte la distance entre les stations, l'affluence et les perturbations aléatoires.",
      role: 'Développeur',
      year: '2026',
      language: 'Python',
      duration: '1 mois',
      description:
        "Ce projet implémente un algorithme A* pour trouver le chemin le plus court entre deux stations du métro parisien. Il prend en compte la distance entre les stations, l'affluence et les perturbations aléatoires.",
      context:
        "Projet réalisé pour la note finale d'algorithmie avancée au 1er semestre de ma formation Bachelor 3 Développement web chez decode.",
      linkLabel: 'Repo github du projet',
      linkUrl: 'https://github.com/siomathisa/3ADW_partiel-metro-algo',
      order: 1,
    },
    media: {
      cover: { asset: 'card projet metrro.png', alt: 'Aperçu du projet Métro parisien' },
      heroImage: { asset: 'page projet metro.png', alt: 'Capture du projet Métro parisien' },
    },
  },
  {
    text: {
      state: 'published',
      slug: 'simulateur-bayesien',
      title: 'Simulateur bayésien',
      tags: ['HTML / CSS', 'JavaScript', 'Mathématiques'],
      excerpt:
        "Un site interactif pour comprendre comment une décision se met à jour avec de nouvelles informations. Trois simulations, une animation continue, et la formule de Bayes expliquée pas à pas.",
      role: 'Développeur',
      year: '2026',
      language: 'JavaScript',
      duration: '2 mois',
      description:
        "Le projet est un site interactif pour comprendre comment une décision se met à jour avec de nouvelles informations. Trois simulations, une animation continue, et la formule de Bayes expliquée pas à pas.",
      context:
        'Projet réalisé pour la note finale de mathématiques appliquées à la programmation au 2ème semestre de ma formation Bachelor 3 Développement web chez decode.',
      collaborator: 'Abdoulaye DIAGNE',
      linkLabel: 'Lien pour voir le projet',
      linkUrl: 'https://maths-course.vercel.app/projet/projet_bayes.html',
      order: 2,
    },
    media: {
      cover: { asset: 'card projet bayes.png', alt: 'Aperçu du simulateur bayésien' },
      heroImage: { asset: 'page projet bayes.png', alt: 'Capture du simulateur bayésien' },
    },
  },
  {
    text: {
      state: 'published',
      slug: 'devinsight',
      title: 'devInsight',
      tags: ['React', 'TypeScript'],
      excerpt:
        "DevInsight est un dashboard d'analyse GitHub qui permet d'analyser un profil GitHub en affichant informations utilisateur, top 5 repositories (triés par stars), répartition des langages sous forme de graphique et dark mode.",
      role: 'Développeur',
      year: '2026',
      language: 'React / TypeScript',
      duration: '2 semaines',
      description:
        "DevInsight est un dashboard d'analyse GitHub développé en React + TypeScript. Il permet d'analyser un profil GitHub en affichant : informations utilisateur, top 5 repositories (triés par stars), répartition des langages sous forme de graphique, dark mode avec persistance (localStorage).",
      context: 'Projet perso réalisé dans le but de développer mes compétences personnelles en React et TypeScript.',
      linkLabel: 'Repo github du projet',
      linkUrl: 'https://github.com/siomathisa/devInsight',
      order: 3,
    },
    media: {
      cover: { asset: 'card projet devinsight.png', alt: 'Aperçu du projet devInsight' },
      heroImage: { asset: 'page projet devinsight.png', alt: 'Capture du projet devInsight' },
    },
  },
];

module.exports = { MATHIS_SEED, MATHIS_PROJECTS };
