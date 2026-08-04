export class HttpError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "HttpError";
    this.status = details.status ?? 0;
    this.url = details.url ?? "";
    this.body = details.body ?? null;
    this.cause = details.cause ?? null;
  }
}

const DEFAULT_OPTIONS = {
  method: "GET",
  timeout: 8000,
  retries: 2,
  retryDelay: 400,
};

const STATUS_MESSAGES = {
  400: "Requête invalide : les données envoyées ont été refusées.",
  401: "Authentification requise ou expirée.",
  403: "Accès refusé : droits insuffisants.",
  404: "Ressource introuvable.",
  409: "Conflit : la ressource a été modifiée entre-temps.",
  429: "Trop de requêtes envoyées, merci de réessayer dans un instant.",
  500: "Le service a rencontré une erreur interne.",
  502: "Le service est momentanément indisponible.",
  503: "Le service est momentanément indisponible.",
  504: "Le service met trop de temps à répondre.",
};

export function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function stringifyQuery(query, prefix = "") {
  if (!query) return [];

  return Object.entries(query).flatMap(([key, value]) => {
    if (value === undefined || value === null) return [];
    const name = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      return value.flatMap((item, index) =>
        typeof item === "object" && item !== null
          ? stringifyQuery(item, `${name}[${index}]`)
          : [[`${name}[${index}]`, String(item)]],
      );
    }
    if (typeof value === "object") return stringifyQuery(value, name);
    return [[name, String(value)]];
  });
}

export function buildUrl(url, query) {
  const entries = stringifyQuery(query);
  if (entries.length === 0) return url;
  const separator = url.includes("?") ? "&" : "?";
  return url + separator + new URLSearchParams(entries).toString();
}

function isRetryable(error) {
  return error.status === 0 || error.status === 429 || error.status >= 500;
}

async function parseBody(response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return response.json();
  const text = await response.text();
  return text === "" ? null : text;
}

async function send(url, settings) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), settings.timeout);

  try {
    const response = await fetch(url, {
      method: settings.method,
      headers: settings.headers,
      body: settings.body,
      signal: settings.signal ?? controller.signal,
      credentials: settings.credentials ?? "omit",
      mode: "cors",
    });

    const body = await parseBody(response);

    if (!response.ok) {
      throw new HttpError(STATUS_MESSAGES[response.status] ?? `Erreur HTTP ${response.status}.`, {
        status: response.status,
        url,
        body,
      });
    }

    return body;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (error.name === "AbortError") {
      throw new HttpError("Le service n'a pas répondu dans le délai imparti.", { url, cause: error });
    }
    throw new HttpError("Service injoignable : vérifiez la connexion ou l'URL du serveur.", {
      url,
      cause: error,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function request(url, options = {}) {
  const settings = { ...DEFAULT_OPTIONS, ...options };
  const headers = { Accept: "application/json", ...settings.headers };
  let body = settings.body;

  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const target = buildUrl(url, settings.query);

  for (let attempt = 0; ; attempt++) {
    try {
      return await send(target, { ...settings, headers, body });
    } catch (error) {
      if (attempt >= settings.retries || !isRetryable(error)) throw error;
      await delay(settings.retryDelay * (attempt + 1));
    }
  }
}

export const get = (url, options) => request(url, { ...options, method: "GET" });
export const post = (url, body, options) => request(url, { ...options, method: "POST", body });
export const put = (url, body, options) => request(url, { ...options, method: "PUT", body });
export const remove = (url, options) => request(url, { ...options, method: "DELETE" });
