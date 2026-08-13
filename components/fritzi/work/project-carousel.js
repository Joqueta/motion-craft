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

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "carousel__arrow carousel__arrow--prev";
    prevBtn.setAttribute("aria-label", "Projet précédent");
    prevBtn.textContent = "←";

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "carousel__arrow carousel__arrow--next";
    nextBtn.setAttribute("aria-label", "Projet suivant");
    nextBtn.textContent = "→";

    function scrollByCard(direction) {
        const card = track.querySelector(".carousel__item");
        if (!card) return;
        const cardWidth = card.getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).columnGap || "0");
        track.scrollBy({ left: direction * (cardWidth + gap), behavior: "smooth" });
    }

    prevBtn.addEventListener("click", () => scrollByCard(-1));
    nextBtn.addEventListener("click", () => scrollByCard(1));

    track.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") scrollByCard(1);
        if (event.key === "ArrowLeft") scrollByCard(-1);
    });

    wrapper.append(prevBtn, track, nextBtn);
    return wrapper;
}