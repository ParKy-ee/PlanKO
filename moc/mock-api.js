// Browser-only Mock API for the PlanKO Content Studio.
// It behaves like a small REST API while persisting project JSON in localStorage.
(function createMocApi() {
  const STORAGE_KEY = 'planko.moc.games.v1';
  let memoryStore = {};

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readStore() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      memoryStore = raw ? JSON.parse(raw) : memoryStore;
    } catch (error) {
      console.warn('Mock API storage read failed; using memory storage.', error);
    }
    return memoryStore;
  }

  function writeStore(store) {
    memoryStore = store;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.warn('Mock API storage write failed; using memory storage.', error);
    }
  }

  function normalizePath(path) {
    return String(path || '')
      .replace(/^https?:\/\/[^/]+/i, '')
      .replace(/^\/api\/?/i, '')
      .replace(/^\/+|\/+$/g, '');
  }

  function makeId(title) {
    return String(title || 'planko-game')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'planko-game';
  }

  function response(status, data) {
    return { ok: status >= 200 && status < 300, status, data: clone(data) };
  }

  async function request(method, path, body) {
    const verb = String(method || 'GET').toUpperCase();
    const parts = normalizePath(path).split('/').filter(Boolean);
    const store = readStore();

    if (parts[0] !== 'games') return response(404, { message: 'Mock API route not found' });

    if (verb === 'GET' && parts.length === 1) {
      return response(200, { items: Object.values(store) });
    }

    if (verb === 'GET' && parts.length === 2) {
      const id = decodeURIComponent(parts[1]);
      const game = store[id];
      if (game) return response(200, game);

      // Optional seed: load an exported JSON file from the sibling moc-api folder.
      try {
        const seedResponse = await fetch(`../moc-api/${encodeURIComponent(id)}.json`, { cache: 'no-store' });
        if (seedResponse.ok) {
          const seededGame = await seedResponse.json();
          store[id] = seededGame;
          writeStore(store);
          return response(200, seededGame);
        }
      } catch (error) {
        // A static file:// page may block fetch; localStorage still works normally.
      }

      return response(404, { message: 'Game not found' });
    }

    if (verb === 'POST' && parts.length === 1) {
      const game = clone(body || {});
      const id = game.id || makeId(game.title);
      if (store[id]) return response(409, { message: 'Game already exists', id });
      game.id = id;
      game.updatedAt = new Date().toISOString();
      store[id] = game;
      writeStore(store);
      return response(201, game);
    }

    if ((verb === 'PUT' || verb === 'PATCH') && parts.length === 2) {
      const id = decodeURIComponent(parts[1]);
      const game = clone(body || {});
      game.id = id;
      game.updatedAt = new Date().toISOString();
      const status = store[id] ? 200 : 201;
      store[id] = game;
      writeStore(store);
      return response(status, game);
    }

    if (verb === 'DELETE' && parts.length === 2) {
      const id = decodeURIComponent(parts[1]);
      if (!store[id]) return response(404, { message: 'Game not found' });
      delete store[id];
      writeStore(store);
      return response(204, null);
    }

    return response(405, { message: 'Mock API method not allowed' });
  }

  window.MocApi = {
    storageKey: STORAGE_KEY,
    request,
    listGames: () => request('GET', '/games'),
    getGame: (id) => request('GET', `/games/${encodeURIComponent(id)}`),
    createGame: (game) => request('POST', '/games', game),
    saveGame: (game) => request('PUT', `/games/${encodeURIComponent(game.id)}`, game),
    deleteGame: (id) => request('DELETE', `/games/${encodeURIComponent(id)}`)
  };
})();
