export const aboutHeroMock = {
    role: "Junior Fullstack Developper",
    locationLabel: "based in",
    location: "Paris, France",
    portrait: {
        url: "https://placehold.co/1600x1400/1a1a1a/3a3a3a?text=+",
        alt: "Portrait de Fritzi Frois"
    },
    paragraphs: [
        "Born and raised in Paris, my journey into technology began quietly during the lockdown years, where I first started experimenting with code. Fast forward four years, and that early curiosity has evolved into formal fullstack development training, driven by a deep, natural sensitivity to design. Today, I work as an apprentice developer within the very institution where I study, bridging the gap between design and engineering on campus-wide products.",
        "Outside of my day job, you'll find me channeling that same creative energy into tangible, tactile hobbies—whether I'm drawing, painting, learning the piano, or losing myself in a good book."
    ]
};

// Reprend la structure des offerings de la home, en ajoutant les liens "related work"
export const offeringsWithLinksMock = [
    {
        id: 1,
        number: "01",
        title: "Front-end",
        tools: "HTML 5, CSS 3, JavaScript, React & Next.js",
        relatedWork: [
            { label: "Tv display", slug: "decode-tv-display" },
            { label: "Web site/ Reponsive", slug: "ecole-innovation-tech" }
        ]
    },
    {
        id: 2,
        number: "02",
        title: "Back-end",
        tools: "PHP, Symfony, C++",
        relatedWork: [
            { label: "Tv display", slug: "decode-tv-display" },
            { label: "Web site/ Reponsive", slug: "ecole-innovation-tech" }
        ]
    },
    {
        id: 3,
        number: "03",
        title: "Fullstack Development",
        tools: "HTML 5, CSS 3, JavaScript, React, Next.js, PHP, Symfony, C++, Wordpress & Github",
        relatedWork: [
            { label: "Tv display", slug: "decode-tv-display" },
            { label: "Web site/ Reponsive", slug: "ecole-innovation-tech" }
        ]
    },
    {
        id: 4,
        number: "04",
        title: "UI / Visual Design",
        tools: "Figma, Illustrator, Indesign & Photoshop",
        relatedWork: [{ label: "Tv display", slug: "decode-tv-display" }]
    }
];