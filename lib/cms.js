import { HttpError, request } from "./http.js";

export function flatten(payload) {
  if (Array.isArray(payload)) return payload.map(flatten);
  if (payload === null || typeof payload !== "object") return payload;

  if ("data" in payload && ("meta" in payload || Object.keys(payload).length === 1)) {
    return flatten(payload.data);
  }

  if ("attributes" in payload && "id" in payload) {
    return { id: payload.id, ...flatten(payload.attributes) };
  }

  return Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, flatten(value)]));
}

export function extractPagination(payload) {
  return payload?.meta?.pagination ?? null;
}

export function createCmsClient({ baseUrl, token = null, timeout = 8000, retries = 2 } = {}) {
  const root = String(baseUrl ?? "").replace(/\/+$/, "");
  let authToken = token;
  let refreshToken = null;
  let refreshListener = null;
  let refreshing = null;

  function rawFetch(endpoint, options = {}) {
    const headers = { ...options.headers };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;

    return request(`${root}/${String(endpoint).replace(/^\/+/, "")}`, {
      timeout,
      retries,
      ...options,
      headers,
    });
  }

  function refreshSession() {
    if (!refreshing) {
      refreshing = rawFetch("api/auth/refresh", {
        method: "POST",
        body: refreshToken ? { refreshToken } : {},
        credentials: "include",
        retries: 0,
      })
        .then((payload) => {
          authToken = payload.jwt;
          if (payload.refreshToken) refreshToken = payload.refreshToken;
          refreshListener?.(authToken);
          return authToken;
        })
        .finally(() => {
          refreshing = null;
        });
    }
    return refreshing;
  }

  async function fetchCMS(endpoint, options = {}) {
    try {
      return await rawFetch(endpoint, options);
    } catch (error) {
      const isAuthRoute = String(endpoint).startsWith("api/auth/");
      const canRetry = error instanceof HttpError && error.status === 401 && authToken && !isAuthRoute && !options._retried;
      if (!canRetry) throw error;

      try {
        await refreshSession();
      } catch {
        throw error;
      }
      return fetchCMS(endpoint, { ...options, _retried: true });
    }
  }

  return {
    fetchCMS,

    get baseUrl() {
      return root;
    },

    setToken(value) {
      authToken = value;
    },

    getToken() {
      return authToken;
    },

    setRefreshToken(value) {
      refreshToken = value;
    },

    onRefresh(listener) {
      refreshListener = listener;
    },

    async find(resource, query = {}) {
      const payload = await fetchCMS(`api/${resource}`, { query });
      return { items: flatten(payload) ?? [], pagination: extractPagination(payload) };
    },

    async findOne(resource, query = {}) {
      const payload = await fetchCMS(`api/${resource}`, { query });
      return flatten(payload);
    },

    async create(resource, data, query = {}) {
      const payload = await fetchCMS(`api/${resource}`, { method: "POST", body: { data }, query, retries: 0 });
      return flatten(payload);
    },

    async update(resource, data, query = {}) {
      const payload = await fetchCMS(`api/${resource}`, { method: "PUT", body: { data }, query, retries: 0 });
      return flatten(payload);
    },

    async remove(resource) {
      const payload = await fetchCMS(`api/${resource}`, { method: "DELETE", retries: 0 });
      return flatten(payload);
    },

    async upload(file, { alt = "" } = {}) {
      const form = new FormData();
      form.append("files", file);
      form.append("fileInfo", JSON.stringify({ alternativeText: alt, caption: alt }));
      const payload = await fetchCMS("api/upload", { method: "POST", body: form, retries: 0 });
      return Array.isArray(payload) ? payload[0] : payload;
    },

    async ping() {
      try {
        await fetchCMS("api/profile", { query: { fields: ["id"] }, timeout: 3000, retries: 0 });
        return true;
      } catch (error) {
        if (error instanceof HttpError && error.status >= 400 && error.status < 500) return true;
        return false;
      }
    },
  };
}
