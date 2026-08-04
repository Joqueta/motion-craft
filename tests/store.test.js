import { describe, expect, it } from "./runner.js";
import createStore from "../lib/store.js";

function tick() {
  return Promise.resolve().then(() => Promise.resolve());
}

describe("createStore", () => {
  it("lit et écrit une valeur", () => {
    const store = createStore({ name: "" });
    store.set("name", "Abdoulaye");
    expect(store.get("name")).toBe("Abdoulaye");
  });

  it("écrit dans un chemin imbriqué sans muter l'ancien état", () => {
    const store = createStore({ profile: { name: "A" } });
    const before = store.get("profile");

    store.set("profile.name", "B");

    expect(store.get("profile.name")).toBe("B");
    expect(before.name).toBe("A");
  });

  it("notifie les abonnés après un changement", async () => {
    const store = createStore({ count: 0 });
    let calls = 0;
    store.subscribe(() => (calls += 1));

    store.set("count", 1);
    await tick();

    expect(calls).toBe(1);
  });

  it("regroupe plusieurs changements en une seule notification", async () => {
    const store = createStore({ a: 0, b: 0 });
    let calls = 0;
    store.subscribe(() => (calls += 1));

    store.set("a", 1);
    store.set("b", 2);
    await tick();

    expect(calls).toBe(1);
  });

  it("ne notifie pas si la valeur est identique", async () => {
    const store = createStore({ count: 1 });
    let calls = 0;
    store.subscribe(() => (calls += 1));

    store.set("count", 1);
    await tick();

    expect(calls).toBe(0);
  });

  it("permet de se désabonner", async () => {
    const store = createStore({ count: 0 });
    let calls = 0;
    const unsubscribe = store.subscribe(() => (calls += 1));

    unsubscribe();
    store.set("count", 1);
    await tick();

    expect(calls).toBe(0);
  });
});
