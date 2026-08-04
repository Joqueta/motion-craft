import client from "./cms-client.js";
import config from "../config.js";
import portfolioStore, { recordAudit } from "../store/portfolio-store.js";

function persist(session) {
  if (session) window.sessionStorage.setItem(config.sessionKey, JSON.stringify(session));
  else window.sessionStorage.removeItem(config.sessionKey);
}

function restore() {
  try {
    return JSON.parse(window.sessionStorage.getItem(config.sessionKey) ?? "null");
  } catch {
    return null;
  }
}

export function currentSession() {
  return portfolioStore.get("session");
}

export function isAdmin() {
  return currentSession()?.role === "admin";
}

export function restoreSession() {
  const session = restore();
  if (!session) return null;
  if (session.token) client.setToken(session.token);
  portfolioStore.update({ session });
  return session;
}

async function establishSession(payload, auditAction) {
  client.setToken(payload.jwt);

  let role = "editor";
  try {
    const me = await client.fetchCMS("api/users/me", { query: { populate: "role" }, retries: 0 });
    role = (me.role?.name ?? "").toLowerCase() === "reader" ? "reader" : "admin";
  } catch {
    role = "admin";
  }

  const session = {
    mode: "cms",
    token: payload.jwt,
    role,
    user: { id: payload.user.id, username: payload.user.username, email: payload.user.email },
  };

  persist(session);
  portfolioStore.update({ session });
  recordAudit(auditAction, "Strapi");
  return session;
}

export async function login(identifier, password) {
  const payload = await client.fetchCMS("api/auth/local", {
    method: "POST",
    body: { identifier, password },
    retries: 0,
  });
  return establishSession(payload, "Connexion au back-office");
}

export async function register(username, email, password) {
  const payload = await client.fetchCMS("api/auth/local/register", {
    method: "POST",
    body: { username, email, password },
    retries: 0,
  });
  return establishSession(payload, "Création de compte");
}

export function loginLocally() {
  const session = {
    mode: "local",
    token: null,
    role: "admin",
    user: { id: null, username: "Mode local", email: "" },
  };

  persist(session);
  portfolioStore.update({ session });
  recordAudit("Ouverture d'une session locale");
  return session;
}

export function logout() {
  recordAudit("Déconnexion du back-office");
  client.setToken(null);
  persist(null);
  portfolioStore.update({ session: null });
}
