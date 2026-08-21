import { describe, expect, it } from "./runner.js";
import { EyeReveal } from "../components/fritzi/eye-reveal.js";

describe("EyeReveal", () => {
  it("lève une erreur si xPercent/yPercent sont manquants", () => {
    expect(() => EyeReveal({})).toThrow();
    expect(() => EyeReveal({ xPercent: 42 })).toThrow();
  });

  it("rend la structure attendue (trigger, mask, 4 accents)", () => {
    const el = EyeReveal({ xPercent: 42, yPercent: 30 });
    expect(el.className).toBe("eye-reveal");
    expect(el.querySelector(".eye-reveal__trigger")).toBeTruthy();
    expect(el.querySelector(".eye-reveal__mask")).toBeTruthy();
    expect(el.querySelectorAll(".eye-reveal__angle").length).toBe(4);
    expect(el.querySelector(".eye-reveal__angle--tl")).toBeTruthy();
    expect(el.querySelector(".eye-reveal__angle--tr")).toBeTruthy();
    expect(el.querySelector(".eye-reveal__angle--bl")).toBeTruthy();
    expect(el.querySelector(".eye-reveal__angle--br")).toBeTruthy();
  });

  it("positionne le centre via les variables CSS --eye-x/--eye-y", () => {
    const el = EyeReveal({ xPercent: 42, yPercent: 30 });
    expect(el.style.getPropertyValue("--eye-x")).toBe("42%");
    expect(el.style.getPropertyValue("--eye-y")).toBe("30%");
  });

  it("ouvre la fenêtre au premier survol et ajoute .is-open", () => {
    const el = EyeReveal({ xPercent: 42, yPercent: 30 });
    document.body.appendChild(el);
    const trigger = el.querySelector(".eye-reveal__trigger");

    expect(el.classList.contains("is-open")).toBeFalsy();
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(el.classList.contains("is-open")).toBeTruthy();

    document.body.removeChild(el);
  });

  it("reste ouvert même après un mouseleave (pas de fermeture)", () => {
    const el = EyeReveal({ xPercent: 42, yPercent: 30 });
    document.body.appendChild(el);
    const trigger = el.querySelector(".eye-reveal__trigger");

    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    expect(el.classList.contains("is-open")).toBeTruthy();

    document.body.removeChild(el);
  });

  it("s'ouvre aussi au premier tap (pointerdown), pour le tactile", () => {
    const el = EyeReveal({ xPercent: 42, yPercent: 30 });
    document.body.appendChild(el);
    const trigger = el.querySelector(".eye-reveal__trigger");

    trigger.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    expect(el.classList.contains("is-open")).toBeTruthy();

    document.body.removeChild(el);
  });

  it("un survol répété une fois ouvert ne change rien", () => {
    const el = EyeReveal({ xPercent: 42, yPercent: 30 });
    document.body.appendChild(el);
    const trigger = el.querySelector(".eye-reveal__trigger");

    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(el.classList.contains("is-open")).toBeTruthy();
    expect(el.classList.length).toBe(2);
    // "eye-reveal" + "is-open", pas de classe dupliquée ou de 3e état

    document.body.removeChild(el);
  });

  it("anime réellement la largeur de la fenêtre entre fermé et ouvert (empêche une régression silencieuse du masque)", async () => {
    const el = EyeReveal({ xPercent: 42, yPercent: 30 });
    document.body.appendChild(el);

    const closedWidth = getComputedStyle(el).getPropertyValue("--window-width").trim();
    el.classList.add("is-open");
    // --window-width transitions over 500ms (see eye-reveal.css); wait for it
    // to settle before reading the final value instead of sampling mid-animation.
    await new Promise((resolve) => setTimeout(resolve, 600));
    const openWidth = getComputedStyle(el).getPropertyValue("--window-width").trim();

    expect(closedWidth).toBe("28px");
    expect(openWidth).toBe("220px");

    document.body.removeChild(el);
  });
});
