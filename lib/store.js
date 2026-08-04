import { getPath, setPath } from "./path.js";

function readPersisted(key) {
  if (!key) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writePersisted(key, keys, state) {
  if (!key) return;
  try {
    const payload = keys ? Object.fromEntries(keys.map((name) => [name, state[name]])) : state;
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    return;
  }
}

export default function createStore(initialState = {}, options = {}) {
  const { persist = null, persistKeys = null } = options;
  const subscribers = new Set();

  let state = { ...initialState, ...(readPersisted(persist) ?? {}) };
  let scheduled = false;

  function notify() {
    if (scheduled) return;
    scheduled = true;
    Promise.resolve().then(() => {
      scheduled = false;
      const snapshot = state;
      subscribers.forEach((subscriber) => subscriber(snapshot));
    });
  }

  function commit(nextState) {
    if (nextState === state) return;
    state = nextState;
    writePersisted(persist, persistKeys, state);
    notify();
  }

  return {
    get(path) {
      return path === undefined ? state : getPath(state, path);
    },

    set(path, value) {
      if (getPath(state, path) === value) return;
      commit(setPath(state, path, value));
    },

    update(partial) {
      commit({ ...state, ...partial });
    },

    reset(nextState = initialState) {
      commit({ ...nextState });
    },

    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
  };
}
