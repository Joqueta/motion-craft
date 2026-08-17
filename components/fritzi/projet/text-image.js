import { FramedImage } from "./framed-image.js";

/**
 * Bloc texte + image côte à côte, orientation configurable.
 * @param {Object} props
 * @param {string} [props.eyebrow]
 * @param {string} [props.heading]
 * @param {string[]} props.paragraphs
 * @param {{url: string, alt: string}} props.image
 * @param {"text-first"|"image-first"} [props.order]
 * @returns {HTMLElement}
 */
export function TextImageBlock(props) {
    validateBlockProps(props);

    const section = document.createElement("section");
    section.className = `text-image-block text-image-block--${props.order || "text-first"}`;

    const textCol = document.createElement("div");
    textCol.className = "text-image-block__text";
    textCol.innerHTML = `
    ${props.eyebrow ? `<span class="text-image-block__eyebrow">${props.eyebrow}</span>` : ""}
    ${props.heading ? `<h3 class="text-image-block__heading">${props.heading}</h3>` : ""}
    ${props.paragraphs.map((p) => `<p class="text-image-block__paragraph">${p}</p>`).join("")}
  `;

    const imageCol = FramedImage({
        ...props.image,
        className: "text-image-block__image"
    });

    section.append(textCol, imageCol);
    return section;
}

function validateBlockProps(props) {
    const required = ["paragraphs", "image"];
    const missing = required.filter((key) => !props[key]);
    if (missing.length > 0) {
        throw new Error(`[TextImageBlock] Props manquantes: ${missing.join(", ")}`);
    }
}