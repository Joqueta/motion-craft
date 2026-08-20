import { describe, expect, it } from "./runner.js";
import matchRoute, { matchPath } from "../components/router/match-route.js";

const routes = {
  "/": () => ({ type: "div" }),
  "/projets": () => ({ type: "div" }),
  "/projets/:slug": () => ({ type: "div" }),
  "/fritzi": () => ({ type: "div" }),
  "/fritzi/about": () => ({ type: "div" }),
  "/fritzi/projets/:slug": () => ({ type: "div" }),
  "*": () => ({ type: "div" }),
};

describe("correspondance des routes", () => {
  it("reconnaît une route statique", () => {
    expect(matchPath("/projets", "/projets")).toEqual({});
  });

  it("extrait un paramètre dynamique", () => {
    expect(matchPath("/projets/:slug", "/projets/vanilla-engine")).toEqual({ slug: "vanilla-engine" });
  });

  it("décode les paramètres encodés", () => {
    expect(matchPath("/projets/:slug", "/projets/mon%20projet")).toEqual({ slug: "mon projet" });
  });

  it("rejette un nombre de segments différent", () => {
    expect(matchPath("/projets/:slug", "/projets")).toBe(null);
  });

  it("privilégie la route statique sur la route dynamique", () => {
    expect(matchRoute(routes, "/projets").pattern).toBe("/projets");
  });

  it("sélectionne la route dynamique et ses paramètres", () => {
    const match = matchRoute(routes, "/projets/vanilla-engine");
    expect(match.pattern).toBe("/projets/:slug");
    expect(match.params).toEqual({ slug: "vanilla-engine" });
  });

  it("retombe sur la page 404", () => {
    expect(matchRoute(routes, "/inconnu/profond").pattern).toBe("*");
  });
});

describe("correspondance des routes fritzi", () => {
  it("reconnaît la route statique /fritzi", () => {
    expect(matchRoute(routes, "/fritzi").pattern).toBe("/fritzi");
  });

  it("reconnaît une route statique imbriquée /fritzi/about", () => {
    expect(matchPath("/fritzi/about", "/fritzi/about")).toEqual({});
    expect(matchRoute(routes, "/fritzi/about").pattern).toBe("/fritzi/about");
  });

  it("extrait le slug de /fritzi/projets/:slug", () => {
    expect(matchPath("/fritzi/projets/:slug", "/fritzi/projets/vanilla-engine")).toEqual({
      slug: "vanilla-engine",
    });
  });

  it("sélectionne /fritzi/projets/:slug et ses paramètres sans collision avec /projets/:slug", () => {
    const fritziMatch = matchRoute(routes, "/fritzi/projets/vanilla-engine");
    expect(fritziMatch.pattern).toBe("/fritzi/projets/:slug");
    expect(fritziMatch.params).toEqual({ slug: "vanilla-engine" });

    const legacyMatch = matchRoute(routes, "/projets/vanilla-engine");
    expect(legacyMatch.pattern).toBe("/projets/:slug");
  });
});
