import defineComponent from "../../lib/props.js";
import Link from "../router/link.js";

const Pagination = defineComponent(
  "Pagination",
  {
    page: { type: "number", required: true },
    pageCount: { type: "number", required: true },
    buildUrl: { type: "function", required: true },
  },
  ({ page, pageCount, buildUrl }) => {
    if (pageCount <= 1) return null;

    const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

    return {
      type: "nav",
      attributes: [
        ["class", ["pagination"]],
        ["aria-label", "Pagination des projets"],
      ],
      children: [
        page > 1
          ? { ...Link({ to: buildUrl(page - 1), label: "Précédent", className: "pagination__step" }), key: "prev" }
          : null,
        {
          type: "ul",
          key: "pages",
          attributes: [["class", ["pagination__list"]]],
          children: pages.map((number) => ({
            type: "li",
            key: String(number),
            children: [
              Link({
                to: buildUrl(number),
                label: String(number),
                className: "pagination__page",
                active: number === page,
              }),
            ],
          })),
        },
        page < pageCount
          ? { ...Link({ to: buildUrl(page + 1), label: "Suivant", className: "pagination__step" }), key: "next" }
          : null,
      ].filter(Boolean),
    };
  },
);

export default Pagination;
