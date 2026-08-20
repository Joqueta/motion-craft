import { escapeHtml } from "../../../lib/text.js";

/**
 * Image plein cadre réutilisable.
 * @param {Object} props
 * @param {string} props.url
 * @param {string} props.alt
 * @param {string} [props.className]
 * @returns {HTMLElement}
 */
export function FramedImage(props) {
    if (!props?.url || !props?.alt) {
        throw new Error("[FramedImage] props.url et props.alt sont requis");
    }

    const wrapper = document.createElement("div");
    wrapper.className = `framed-image ${props.className || ""}`.trim();
    wrapper.innerHTML = `<img src="${escapeHtml(props.url)}" alt="${escapeHtml(props.alt)}" />`;
    return wrapper;
}