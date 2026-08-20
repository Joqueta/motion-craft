import { describe, expect, it } from "./runner.js";
import { createCmsClient } from "../lib/cms.js";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("createCmsClient — rafraîchissement automatique du token", () => {
  it("sur un 401, rafraîchit le token via /api/auth/refresh puis rejoue la requête originale", async () => {
    const client = createCmsClient({ baseUrl: "http://test.local" });
    client.setToken("old-token");
    client.setRefreshToken("old-refresh-token");

    const calls = [];
    const originalFetch = window.fetch;
    window.fetch = async (url, options) => {
      calls.push({ url: String(url), headers: { ...options.headers } });

      if (String(url).includes("/api/auth/refresh")) return jsonResponse({ jwt: "new-token" });

      const projectCalls = calls.filter((call) => call.url.includes("/api/fritzi-projects"));
      if (projectCalls.length === 1) {
        return jsonResponse({ error: { message: "Missing or invalid credentials" } }, 401);
      }
      return jsonResponse({ data: [], meta: {} });
    };

    try {
      const result = await client.find("fritzi-projects");
      expect(result.items).toEqual([]);
      expect(client.getToken()).toBe("new-token");

      const projectCalls = calls.filter((call) => call.url.includes("/api/fritzi-projects"));
      expect(projectCalls.length).toBe(2);
      expect(projectCalls[0].headers.Authorization).toBe("Bearer old-token");
      expect(projectCalls[1].headers.Authorization).toBe("Bearer new-token");
    } finally {
      window.fetch = originalFetch;
    }
  });

  it("ne boucle pas indéfiniment si la requête échoue encore après rafraîchissement", async () => {
    const client = createCmsClient({ baseUrl: "http://test.local" });
    client.setToken("old-token");
    client.setRefreshToken("old-refresh-token");

    let callCount = 0;
    const originalFetch = window.fetch;
    window.fetch = async (url) => {
      callCount++;
      if (String(url).includes("/api/auth/refresh")) return jsonResponse({ jwt: "new-token" });
      return jsonResponse({ error: { message: "Missing or invalid credentials" } }, 401);
    };

    try {
      let thrown = null;
      try {
        await client.find("fritzi-projects");
      } catch (error) {
        thrown = error;
      }
      expect(thrown).toBeTruthy();
      expect(thrown.status).toBe(401);
      expect(callCount).toBe(3);
    } finally {
      window.fetch = originalFetch;
    }
  });

  it("n'essaie pas de rafraîchir sur un 401 renvoyé par /api/auth/local lui-même", async () => {
    const client = createCmsClient({ baseUrl: "http://test.local" });

    let callCount = 0;
    const originalFetch = window.fetch;
    window.fetch = async () => {
      callCount++;
      return jsonResponse({ error: { message: "Invalid identifier or password" } }, 401);
    };

    try {
      let thrown = null;
      try {
        await client.fetchCMS("api/auth/local", { method: "POST", body: { identifier: "x", password: "y" }, retries: 0 });
      } catch (error) {
        thrown = error;
      }
      expect(thrown).toBeTruthy();
      expect(callCount).toBe(1);
    } finally {
      window.fetch = originalFetch;
    }
  });
});
