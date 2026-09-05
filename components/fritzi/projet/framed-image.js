import { escapeHtml } from "../../../lib/text.js";

export function FramedImage(props) {
    const wrapper = document.createElement("div");
    wrapper.className = `framed-image ${props?.className || ""}`.trim();
    wrapper.innerHTML = `<img src="${escapeHtml(props?.url || "")}" alt="${escapeHtml(props?.alt || "")}" />`;
    return wrapper;
}