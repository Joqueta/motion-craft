'use strict';

const HOME_OFFERINGS = [
  {
    number: '01',
    title: 'Front-end',
    tag: 'Related work',
    tools: 'HTML 5, CSS 3, JavaScript, React & Next.js',
    work: ['TV display', 'Web site/ Reponsive'],
  },
  {
    number: '02',
    title: 'Back-end',
    tag: 'Related work',
    tools: 'PHP, Symfony, C++',
    work: ['TV display', 'Web site/ Reponsive'],
  },
  {
    number: '03',
    title: 'Fullstack Development',
    tag: 'Related work',
    tools: 'HTML 5, CSS 3, JavaScript, React, PHP, Symfony, C++, Wordpress & Github',
    work: ['TV display', 'Web site/ Reponsive'],
  },
  {
    number: '04',
    title: 'UI / Visual Design',
    tag: 'Related work',
    tools: 'Figma, Illustrator, InDesign & Photoshop',
    work: ['TV display'],
  },
];

const ABOUT_OFFERINGS = [
  {
    number: '01',
    title: 'Front-end',
    tools: 'HTML 5, CSS 3, JavaScript, React & Next.js',
    relatedWork: [
      { label: 'Tv display', slug: 'decode-tv-display' },
      { label: 'Web site/ Reponsive', slug: 'ecole-innovation-tech' },
    ],
  },
  {
    number: '02',
    title: 'Back-end',
    tools: 'PHP, Symfony, C++',
    relatedWork: [
      { label: 'Tv display', slug: 'decode-tv-display' },
      { label: 'Web site/ Reponsive', slug: 'ecole-innovation-tech' },
    ],
  },
  {
    number: '03',
    title: 'Fullstack Development',
    tools: 'HTML 5, CSS 3, JavaScript, React, Next.js, PHP, Symfony, C++, Wordpress & Github',
    relatedWork: [
      { label: 'Tv display', slug: 'decode-tv-display' },
      { label: 'Web site/ Reponsive', slug: 'ecole-innovation-tech' },
    ],
  },
  {
    number: '04',
    title: 'UI / Visual Design',
    tools: 'Figma, Illustrator, Indesign & Photoshop',
    relatedWork: [{ label: 'Tv display', slug: 'decode-tv-display' }],
  },
];

const FRITZI_SEED = {
  'api::fritzi-profile.fritzi-profile': {
    text: {
      firstName: 'Fritzi',
      lastName: 'Frois',
      role: 'Junior Fullstack Developer',
      bio: 'Paris-raised and based. Three years of experience across software development, design and digital marketing.',
      statusLabel: 'Working at .decode',
      statusActive: true,
      location: 'Paris, France',
      year: '2026',
      email: 'fritzi.froispro@gmail.com',
      linkedin: 'https://linkedin.com/',
      instagram: 'https://instagram.com/',
      contactHeading: ['Come', 'say', 'hi'],
    },
    media: {},
  },

  'api::fritzi-home.fritzi-home': {
    text: {
      aboutHeading: 'About me',
      quoteLead: 'A [tech-driven] perspective shaped by',
      quoteHighlight1: 'Front-end',
      quoteConnector: 'and a',
      quoteHighlight2: 'Back-end',
      quoteTail: 'upbringing.',
      aboutCaption:
        'A design approach led by curiosity, logic, and empathy. All digital experiences are crafted to be intuitive, functional, and quietly delightful.',
      skillsEyebrow: 'My offerings',
      skillsLine1: 'Person',
      skillsConnector: 'and',
      skillsLine2: 'skills',
      skillsParagraphs: [
        'Three years of building at the intersection of design and code. From my early days supporting non-profits to my current role scaling digital tools for a major educational institution, I bridge the gap between "how it looks" and "how it works".',
        'I currently own the development of institutional sites, blogs, and internal applications used by the entire campus. My approach is rooted in logic; I spent my high school years immersed in Advanced Math, Chemistry and Engineering Sciences before I even write a line of CSS.',
        "I thrive in environments where I can own the full scope — from the initial UI concept to the final shipped component. I'm not just looking for a task; I'm looking to build tools that people actually use.",
      ],
      cvLabel: 'Upload my CV here',
      offerings: HOME_OFFERINGS,
    },
    media: {
      aboutPortrait: { asset: 'home/bg-about-me.svg', alt: 'Portrait de Fritzi Frois' },
      offeringsImage: { asset: 'home/LEAF.svg', alt: 'feuille de plante verte' },
    },
  },

  'api::fritzi-about.fritzi-about': {
    text: {
      heroRole: 'Junior Fullstack Developper',
      heroLocationLabel: 'based in',
      heroLocation: 'Paris, France',
      heroParagraphs: [
        'Born and raised in Paris, my journey into technology began quietly during the lockdown years, where I first started experimenting with code. Fast forward four years, and that early curiosity has evolved into formal fullstack development training, driven by a deep, natural sensitivity to design. Today, I work as an apprentice developer within the very institution where I study, bridging the gap between design and engineering on campus-wide products.',
        "Outside of my day job, you'll find me channeling that same creative energy into tangible, tactile hobbies—whether I'm drawing, painting, learning the piano, or losing myself in a good book.",
      ],
      offerings: ABOUT_OFFERINGS,
    },
    media: {
      heroPortrait: { asset: 'about/bg-about-me.svg', alt: 'Portrait de Fritzi Frois' },
    },
  },

  'api::fritzi-contact.fritzi-contact': {
    text: {},
    media: {
      heroPortrait: { asset: 'contact/bg-contact.svg', alt: 'Portrait de Fritzi Frois' },
    },
  },

  'api::fritzi-project.fritzi-project': {
    text: {
      slug: 'decode-tv-display',
      client: '.decode',
      label: 'TV display',
      featured: true,
      order: 0,
      state: 'published',
      title: 'TV Display',
      eyebrow: 'Collection of work',
      meta: [
        { label: 'Deliverable', value: 'TV App' },
        { label: 'Company', value: '.decode' },
        { label: 'Role', value: 'Fullstack Developer\nVisual Designer' },
        { label: 'Service', value: 'Developement UI/UX' },
      ],
      overview: {
        sideLabel: 'Linkedin',
        eyebrow: 'Overview',
        heading:
          'Digital tools often isolate us. This TV application replaces endless scrolling with shared daily moods, campus updates, and lunch decisions.',
        paragraphs: [
          "The aim of the project looks to bring back what the student community genuinely desires: a stripped-back, authentic, and frictionless campus experience. We wanted to create an intuitive hub that avoids the noise of classroom schedules and BOE announcements to daily moods and weather at the students' fingertips, further bringing the campus together and fostering daily interactions.",
          'The project was run based on an Agile delivery method, focusing on rapid prototyping and user feedback.',
        ],
      },
      discovery: {
        eyebrow: 'Discovery phase',
        heading: 'Understanding the problem',
        paragraphs: [
          "The discovery phase began with deep stakeholder alignment to uncover the project's true core: defining the why, the how, and the why. By challenging the client's initial brief, we mapped out the essential pillars of the application and pinpointed exactly what needed to be provided.",
          'Through this collaborative process, it became clear the user personas had to bridge a unique gap—harmonizing the rigorous, functional requirements of a tech product with the established creative direction and brand identity of the school.',
        ],
      },
      challenge: {
        eyebrow: 'The challenge',
        heading: 'Balancing a strict corporate identity with student-centric simplicity',
        paragraphs: [
          "The primary challenge centered on adopting and mastering an unfamiliar, established artistic direction while keeping the product intuitive for the student body. The school's visual identity required absolute compliance, yet the interface needed to remain stripped-back, accessible, and engaging for daily campus use.",
          "Navigating the friction between the client's strict technical constraints and the students' need for a seamless, frictionless experience meant designing within tight boundaries. Success depended on finding the perfect intersection: honoring a sophisticated brand guidelines framework without compromising the ultimate usability of the application.",
        ],
      },
      outcome: {
        eyebrow: 'The outcome & reflection',
        heading: 'Bridging the gap between code, design, and community',
        paragraphs: [
          'The final application successfully transformed a static lobby display into a dynamic, central ecosystem for the entire campus. By managing the full product cycle from shaping the initial client brief to shipping the final frontend and backend architecture, the project proved that strict design constraints can coexist with a playful, highly interactive user experience.',
          'Ultimately, this application went beyond just displaying data, it strengthened campus culture by actively fostering a stronger sense of community among the student body. It stands as a testament to the power of thoughtful product engineering, building scalable, technically sound tools that people genuinely love using every day.',
        ],
      },
    },
    media: {
      cover: { asset: 'default-image.svg', alt: "Aperçu de l'affichage TV pour .decode" },
      heroImage: { asset: 'default-image.svg', alt: "Mockup de l'application TV sur un ordinateur portable" },
      'discovery.image': { asset: 'default-image.svg', alt: 'Carte de visite .decode posée sur une table' },
      'challenge.backgroundImage': {
        asset: 'default-image.svg',
        alt: 'Équipe en réunion devant les écrans TV installés',
      },
      'outcome.image': { asset: 'default-image.svg', alt: 'Équipe installant le écran TV sur le mur du campus' },
    },
  },
};

module.exports = { FRITZI_SEED };
