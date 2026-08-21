import { escapeHtml } from "../../../lib/text.js";

/**
 * Image plein cadre réutilisable.
 * @param {Object} props
 * @param {string} [props.url] - vide si non renseigné dans le CMS
 * @param {string} [props.alt] - texte alternatif, vide si non renseigné dans le CMS
 * @param {string} [props.className]
 * @returns {HTMLElement}
 */
export function FramedImage(props) {
    const wrapper = document.createElement("div");
    wrapper.className = `framed-image ${props?.className || ""}`.trim();
    wrapper.innerHTML = `<img src="${escapeHtml(props?.url || "")}" alt="${escapeHtml(props?.alt || "")}" />`;
    return wrapper;
}