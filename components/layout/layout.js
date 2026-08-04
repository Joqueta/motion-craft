import defineComponent from "../../lib/props.js";
import Header from "./header.js";
import Footer from "./footer.js";
import Notice from "../ui/notice.js";
import CookieBanner from "../ui/cookie-banner.js";
import portfolioStore from "../../store/portfolio-store.js";

const Layout = defineComponent(
  "Layout",
  {
    path: { type: "string", default: "/" },
    className: { type: "string", default: "" },
    children: { type: "array", default: [] },
  },
  ({ path, className, children }) => {
    const profile = portfolioStore.get("content.profile");
    const notice = portfolioStore.get("notice");
    const source = portfolioStore.get("source");

    return {
      type: "div",
      attributes: [["class", ["app"]]],
      children: [
        {
          type: "a",
          attributes: [
            ["href", "#contenu"],
            ["class", ["skip-link"]],
          ],
          children: ["Aller au contenu principal"],
        },
        { type: "div", attributes: [["class", ["decor"]], ["aria-hidden", "true"]] },
        Header({ name: profile.name, path }),
        notice ? Notice({ message: notice.message, tone: notice.tone }) : null,
        {
          type: "main",
          attributes: [
            ["id", "contenu"],
            ["class", ["app__main", className]],
            ["tabindex", "-1"],
          ],
          children,
        },
        Footer({ name: profile.name, links: profile.links ?? [], source }),
        CookieBanner(),
      ].filter(Boolean),
    };
  },
);

export default Layout;
