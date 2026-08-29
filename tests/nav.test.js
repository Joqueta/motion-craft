import { describe, expect, it } from "./runner.js";
import { Nav } from "../components/fritzi/nav.js";

function buildProps() {
  return { logo: { url: "/logo.svg", alt: "Logo" }, year: "2026" };
}

describe("Nav (fritzi)", () => {
  it("retourne un fragment contenant le skip-link puis le header", () => {
    const fragment = Nav(buildProps());

    expect(fragment.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
    expect(fragment.children.length).toBe(2);
    expect(fragment.children[0].className).toBe("skip-link");
    expect(fragment.children[0].getAttribute("href")).toBe("#contenu");
    expect(fragment.children[1].tagName).toBe("HEADER");
    expect(fragment.children[1].className).toBe("nav");
  });

  it("lève toujours une erreur si props.logo.url est manquant", () => {
    expect(() => Nav({})).toThrow();
  });
});
