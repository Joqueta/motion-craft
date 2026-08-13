export const workPageMock = {
    eyebrow: "10 Projects featured",
    title: "Work"
};

// Structure identique à ce que renverra GET /api/fritzi-projects (ordre = ordre d'affichage)
export const allProjectsMock = [
    {
        id: 1,
        slug: "decode-tv-display",
        client: ".decode",
        label: "TV display",
        cover: {
            url: "https://placehold.co/500x640/E4DFD1/1a1a1a?text=TV+Display",
            alt: "Aperçu de l'affichage TV pour .decode"
        }
    },
    {
        id: 2,
        slug: "ecole-innovation-tech",
        client: ".decode",
        label: "Website/ Responsive",
        cover: {
            url: "https://placehold.co/500x640/151515/EDE9DD?text=L%27ecole",
            alt: "Aperçu du site de l'École de l'innovation tech"
        }
    },
    {
        id: 3,
        slug: "decode-tv-display-2",
        client: ".decode",
        label: "TV display",
        cover: {
            url: "https://placehold.co/500x640/E4DFD1/1a1a1a?text=TV+Display",
            alt: "Aperçu de l'affichage TV pour .decode"
        }
    },
    {
        id: 4,
        slug: "brand-identity-studio",
        client: "Studio Lumen",
        label: "Brand identity",
        cover: {
            url: "https://placehold.co/500x640/2a2a2a/EDE9DD?text=Lumen",
            alt: "Aperçu de l'identité de marque Studio Lumen"
        }
    },
    {
        id: 5,
        slug: "mobile-app-ui",
        client: "Nomad",
        label: "Mobile app UI",
        cover: {
            url: "https://placehold.co/500x640/E4DFD1/1a1a1a?text=Nomad+App",
            alt: "Aperçu de l'interface mobile Nomad"
        }
    },
    {
        id: 6,
        slug: "campus-dashboard",
        client: ".decode",
        label: "Internal dashboard",
        cover: {
            url: "https://placehold.co/500x640/151515/EDE9DD?text=Dashboard",
            alt: "Aperçu du dashboard interne campus"
        }
    }
];