import { describe, expect, it } from "./runner.js";
import defineComponent, { validateProps } from "../lib/props.js";

describe("validation des props", () => {
  it("accepte des props conformes", () => {
    const props = validateProps("Card", { title: { type: "string", required: true } }, { title: "Hello" });
    expect(props.title).toBe("Hello");
  });

  it("refuse une prop obligatoire manquante", () => {
    expect(() => validateProps("Card", { title: { type: "string", required: true } }, {})).toThrow();
  });

  it("refuse un type incorrect", () => {
    expect(() => validateProps("Card", { level: { type: "number" } }, { level: "trois" })).toThrow();
  });

  it("applique la valeur par défaut", () => {
    const props = validateProps("Card", { tone: { type: "string", default: "info" } }, {});
    expect(props.tone).toBe("info");
  });

  it("refuse une valeur hors de la liste autorisée", () => {
    const schema = { tone: { type: "string", values: ["info", "error"] } };
    expect(() => validateProps("Card", schema, { tone: "bleu" })).toThrow();
  });

  it("valide les props au moment du rendu du composant", () => {
    const Card = defineComponent("Card", { title: { type: "string", required: true } }, ({ title }) => ({
      type: "h3",
      children: [title],
    }));

    expect(Card({ title: "OK" }).children[0]).toBe("OK");
    expect(() => Card({})).toThrow();
  });
});
