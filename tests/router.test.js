import { describe, expect, it } from "./runner.js";
import matchRoute, { matchPath } from "../components/router/match-route.js";

const routes = {
  "/": () => ({ type: "div" }),
  "/projets": () => ({ type: "div" }),
  "/projets/:slug": () => ({ type: "div" }),
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
