    /* Saar service worker: pages a student has opened keep working offline. */
    const VERSION = "saar-v1";
    const PAGES = `${VERSION}-pages`;
    const ASSETS = `${VERSION}-assets`;
    const OFFLINE_URL = "/offline.html";
    const START = ["/", OFFLINE_URL, "/favicon.svg"];

    async function trim(name, max) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    if (keys.length > max) {
        await Promise.all(keys.slice(0, keys.length - max).map((k) => cache.delete(k)));
    }
    }

    async function precache(cache, url) {
    try {
        const res = await fetch(url);
        if (res.ok && !res.redirected) await cache.put(url, res);
    } catch {}
    }

    self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
        .open(PAGES)
        .then((cache) => Promise.all(START.map((u) => precache(cache, u))))
        .then(() => self.skipWaiting())
    );
    });

    self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
        .keys()
        .then((keys) =>
            Promise.all(keys.filter((k) => !k.startsWith(`${VERSION}-`)).map((k) => caches.delete(k)))
        )
        .then(() => self.clients.claim())
    );
    });

    // Build files have hashed names and never change, so the cache is always right
    async function cacheFirst(req) {
    const cache = await caches.open(ASSETS);
    const hit = await cache.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok && !res.redirected) {
        cache.put(req, res.clone());
        trim(ASSETS, 300);
    }
    return res;
    }

    // Pages, notes and files: use the network, and fall back to the saved copy offline
    async function networkFirst(req) {
    const cache = await caches.open(PAGES);
    try {
        const res = await fetch(req);
        if (res.ok && !res.redirected) {
        cache.put(req, res.clone());
        trim(PAGES, 200);
        }
        return res;
    } catch {
        const hit = await cache.match(req, { ignoreSearch: true });
        if (hit) return hit;
        if (req.mode === "navigate") {
        const offline = await cache.match(OFFLINE_URL);
        if (offline) return offline;
        }
        return Response.error();
    }
    }

    self.addEventListener("fetch", (event) => {
    const req = event.request;
    if (req.method !== "GET") return;

    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;
    if (url.pathname === "/sw.js") return;

    if (url.pathname.startsWith("/_next/static/")) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req));
    }
    });