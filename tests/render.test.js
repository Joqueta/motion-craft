import { describe, expect, it } from "./runner.js";
import { createRoot } from "../lib/render.js";
import generateStructure from "../lib/generate-structure.js";

function mount() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  return { container, render: createRoot(container) };
}

describe("generateStructure", () => {
  it("crée un élément avec ses attributs", () => {
    const element = generateStructure({
      type: "a",
      attributes: [
        ["href", "/projets"],
        ["class", ["link", "link--primary"]],
      ],
      children: ["Projets"],
    });

    expect(element.tagName).toBe("A");
    expect(element.getAttribute("href")).toBe("/projets");
    expect(element.className).toBe("link link--primary");
    expect(element.textContent).toBe("Projets");
  });

  it("résout un composant passé comme type", () => {
    const Badge = ({ label }) => ({ type: "span", children: [label] });
    const element = generateStructure({ type: Badge, attributes: [["label", "Nouveau"]] });

    expect(element.tagName).toBe("SPAN");
    expect(element.textContent).toBe("Nouveau");
  });
});

describe("diffing DOM", () => {
  it("met à jour un texte sans recréer le nœud", () => {
    const { container, render } = mount();
    render({ type: "p", children: ["avant"] });
    const paragraph = container.firstChild;

    render({ type: "p", children: ["après"] });

    expect(container.firstChild).toBe(paragraph);
    expect(paragraph.textContent).toBe("après");
  });

  it("conserve le focus et la valeur d'un champ pendant un re-render", () => {
    const { container, render } = mount();
    const structure = (value) => ({
      type: "div",
      children: [
        { type: "input", attributes: [["value", value]] },
        { type: "p", children: [value] },
      ],
    });

    render(structure("a"));
    const input = container.querySelector("input");
    input.focus();

    render(structure("ab"));

    expect(container.querySelector("input")).toBe(input);
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe("ab");
  });

  it("remplace un nœud lorsque le type change", () => {
    const { container, render } = mount();
    render({ type: "p", children: ["texte"] });
    render({ type: "h2", children: ["texte"] });

    expect(container.firstChild.tagName).toBe("H2");
  });

  it("ajoute et retire des enfants", () => {
    const { container, render } = mount();
    const list = (count) => ({
      type: "ul",
      children: Array.from({ length: count }, (_, index) => ({
        type: "li",
        children: [String(index)],
      })),
    });

    render(list(2));
    expect(container.querySelectorAll("li").length).toBe(2);

    render(list(4));
    expect(container.querySelectorAll("li").length).toBe(4);

    render(list(1));
    expect(container.querySelectorAll("li").length).toBe(1);
  });

  it("réutilise les nœuds identifiés par une clé lors d'une réorganisation", () => {
    const { container, render } = mount();
    const list = (keys) => ({
      type: "ul",
      children: keys.map((key) => ({ type: "li", key, children: [key] })),
    });

    render(list(["a", "b", "c"]));
    const first = container.querySelectorAll("li")[0];

    render(list(["c", "a", "b"]));
    const reordered = container.querySelectorAll("li");

    expect(reordered[1]).toBe(first);
    expect([...reordered].map((item) => item.textContent)).toEqual(["c", "a", "b"]);
  });

  it("supprime un attribut absent du nouveau rendu", () => {
    const { container, render } = mount();
    render({ type: "div", attributes: [["title", "info"]] });
    render({ type: "div", attributes: [] });

    expect(container.firstChild.hasAttribute("title")).toBeFalsy();
  });

  it("remplace un écouteur d'évènement obsolète", () => {
    const { container, render } = mount();
    let first = 0;
    let second = 0;

    render({ type: "button", events: [["click", () => (first += 1)]] });
    render({ type: "button", events: [["click", () => (second += 1)]] });
    container.firstChild.click();

    expect(first).toBe(0);
    expect(second).toBe(1);
  });
});
