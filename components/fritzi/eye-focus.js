/**
 * Effet "viseur photo" : 4 coins en L positionnés autour d'un point (les yeux),
 * qui s'écartent en douceur quand le curseur s'en approche.
 *
 * @param {Object} props
 * @param {number} props.xPercent   - position horizontale du centre (0-100, % du conteneur)
 * @param {number} props.yPercent   - position verticale du centre (0-100, % du conteneur)
 * @param {number} [props.triggerRadius] - distance en px déclenchant l'ouverture (défaut 140)
 * @param {number} [props.closedSize]    - taille du carré fermé en px (défaut 34)
 * @param {number} [props.openSize]      - taille du carré ouvert en px (défaut 78)
 * @returns {HTMLElement}
 */
export function EyeFocus(props) {
    validateEyeFocusProps(props);

    const {
        xPercent,
        yPercent,
        triggerRadius = 140,
        closedSize = 34,
        openSize = 78
    } = props;

    const wrapper = document.createElement("div");
    wrapper.className = "eye-focus";
    wrapper.style.left = `${xPercent}%`;
    wrapper.style.top = `${yPercent}%`;
    wrapper.style.setProperty("--closed-size", `${closedSize}px`);
    wrapper.style.setProperty("--open-size", `${openSize}px`);

    wrapper.innerHTML = `
    <span class="eye-focus__corner eye-focus__corner--tl"></span>
    <span class="eye-focus__corner eye-focus__corner--tr"></span>
    <span class="eye-focus__corner eye-focus__corner--bl"></span>
    <span class="eye-focus__corner eye-focus__corner--br"></span>
  `;

    // Le parent positionné en relative sert de référentiel pour calculer la distance
    requestAnimationFrame(() => {
        const container = wrapper.closest("[data-eye-focus-container]") || wrapper.parentElement;
        if (!container) return;
        bindProximityListener(container, wrapper, triggerRadius);
    });

    return wrapper;
}

/**
 * Écoute le mouvement de souris sur le conteneur et bascule la classe
 * "is-open" selon la distance entre le curseur et le centre du composant.
 */
function bindProximityListener(container, wrapper, triggerRadius) {
    let ticking = false;

    container.addEventListener("mousemove", (event) => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const rect = wrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
            wrapper.classList.toggle("is-open", distance < triggerRadius);

            ticking = false;
        });
    });

    container.addEventListener("mouseleave", () => {
        wrapper.classList.remove("is-open");
    });
}

function validateEyeFocusProps(props) {
    const required = ["xPercent", "yPercent"];
    const missing = required.filter((key) => props?.[key] === undefined);
    if (missing.length > 0) {
        throw new Error(`[EyeFocus] Props manquantes: ${missing.join(", ")}`);
    }
}