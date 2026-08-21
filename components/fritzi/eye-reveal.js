const ANGLE_TOP_SVG = `<svg viewBox="0 0 133 118" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M7.59375 117.103L7.59375 0.0625036L15.4025 105.103L7.59375 117.103Z" fill="#D3C7AD"/>
  <path d="M123.648 0.000396729L7.14844 0.506088L117.788 11.3975L123.648 0.000396729Z" fill="#D3C7AD"/>
</svg>`;

const ANGLE_BOTTOM_SVG = `<svg viewBox="0 0 133 118" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M116.18 0L116.18 117.157L108.363 12.012L116.18 0Z" fill="#D3C7AD"/>
  <path d="M0 117.219L116.616 116.713L5.86678 105.811L0 117.219Z" fill="#D3C7AD"/>
</svg>`;

/**
 * Effet "fenêtre qui s'ouvre" sur les yeux : un calque flou/assombri
 * recouvre la photo, une fenêtre de découpe s'élargit horizontalement au
 * premier survol (ou tap) et reste ouverte pour le reste de la session.
 *
 * @param {Object} props
 * @param {number} props.xPercent        - centre horizontal (0-100, % du conteneur)
 * @param {number} props.yPercent        - centre vertical (0-100, % du conteneur)
 * @param {number} [props.closedWidth]   - largeur de la fente fermée en px (défaut 28)
 * @param {number} [props.openWidth]     - largeur de la fenêtre ouverte en px (défaut 220)
 * @param {number} [props.fixedHeight]   - hauteur fixe de la fenêtre en px (défaut 40)
 * @param {number} [props.triggerWidth]  - largeur de la zone de hover/tap en px (défaut 140)
 * @param {number} [props.triggerHeight] - hauteur de la zone de hover/tap en px (défaut 90)
 * @returns {HTMLElement}
 */
export function EyeReveal(props) {
  validateEyeRevealProps(props);

  const {
    xPercent,
    yPercent,
    closedWidth = 10,
    openWidth = 220,
    fixedHeight = 90,
    triggerWidth = 220,
    triggerHeight = 90,
  } = props;

  const wrapper = document.createElement("div");
  wrapper.className = "eye-reveal";
  wrapper.style.setProperty("--eye-x", "40%");
  wrapper.style.setProperty("--eye-y", "50%");
  wrapper.style.setProperty("--closed-width", `${closedWidth}px`);
  wrapper.style.setProperty("--open-width", `${openWidth}px`);
  wrapper.style.setProperty("--fixed-height", `${fixedHeight}px`);
  wrapper.style.setProperty("--trigger-width", `${triggerWidth}px`);
  wrapper.style.setProperty("--trigger-height", `${triggerHeight}px`);

  wrapper.innerHTML = `
    <div class="eye-reveal__trigger"></div>
    <div class="eye-reveal__mask"></div>
    <span class="eye-reveal__angle eye-reveal__angle--tr">${ANGLE_TOP_SVG}</span>
    <span class="eye-reveal__angle eye-reveal__angle--br">${ANGLE_BOTTOM_SVG}</span>
  `;

  bindOpenOnce(wrapper);

  return wrapper;
}

function bindOpenOnce(wrapper) {
  const trigger = wrapper.querySelector(".eye-reveal__trigger");
  let isEyesOpen = false;

  function open() {
    if (isEyesOpen) return;
    isEyesOpen = true;
    wrapper.classList.add("is-open");
  }

  trigger.addEventListener("mouseenter", open);
  trigger.addEventListener("pointerdown", open);
}

function validateEyeRevealProps(props) {
  const required = ["xPercent", "yPercent"];
  const missing = required.filter((key) => props?.[key] === undefined);
  if (missing.length > 0) {
    throw new Error(`[EyeReveal] Props manquantes: ${missing.join(", ")}`);
  }
}
