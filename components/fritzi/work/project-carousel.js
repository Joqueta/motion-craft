import { WorkProjectCard } from "./work-project-card.js";

/**
 * Carrousel horizontal de projets (scroll-snap natif, pas de librairie).
 * @param {Object} props
 * @param {Array} props.projects
 * @returns {HTMLElement}
 */
export function ProjectCarousel(props) {
    if (!Array.isArray(props?.projects) || props.projects.length === 0) {
        throw new Error("[ProjectCarousel] props.projects doit être un tableau non vide");
    }

    const wrapper = document.createElement("div");
    wrapper.className = "carousel";

    const track = document.createElement("div");
    track.className = "carousel__track";
    track.setAttribute("role", "list");
    track.setAttribute("tabindex", "0");
    track.setAttribute("aria-label", "Liste des projets");

    props.projects.forEach((project) => {
        const card = WorkProjectCard(project);
        card.setAttribute("role", "listitem");
        card.classList.add("carousel__item");
        track.appendChild(card);
    });

    track.addEventListener("keydown", (event) => {
        const card = track.querySelector(".carousel__item");
        if (!card) return;
        const cardWidth = card.getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    });

    wrapper.append(track);
    return wrapper;
}