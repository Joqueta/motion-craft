import "../lib/interpolate.js";
import { describe, expect, it } from "./runner.js";

describe("String.prototype.interpolate", () => {
  it("remplace une clé simple", () => {
    expect("Bonjour {{ name }}".interpolate({ name: "Abdoulaye" })).toBe("Bonjour Abdoulaye");
  });

  it("accepte un chemin imbriqué", () => {
    expect("Type : {{ type.name }}".interpolate({ type: { name: "chien" } })).toBe("Type : chien");
  });

  it("accepte un index de tableau", () => {
    expect("{{ tags[1] }}".interpolate({ tags: ["a", "b"] })).toBe("b");
  });

  it("tolère les espaces autour de la clé", () => {
    expect("{{name}} / {{   name   }}".interpolate({ name: "X" })).toBe("X / X");
  });

  it("remplace une clé absente par une chaîne vide", () => {
    expect("Valeur : {{ inconnu.chemin }}".interpolate({})).toBe("Valeur : ");
  });

  it("convertit les nombres et les booléens", () => {
    expect("{{ n }}-{{ b }}".interpolate({ n: 5, b: false })).toBe("5-false");
  });

  it("laisse le texte intact sans placeholder", () => {
    expect("Aucun remplacement".interpolate({ name: "X" })).toBe("Aucun remplacement");
  });
});
