const version = "2";

const cacheName = `caches_${version}`;

self.addEventListener("install", onInstall);

self.addEventListener("activate", onActivate);

self.addEventListener("fetch", onFetch);

function onInstall(event) {
  self.skipWaiting();

  event.waitUntil(
    self.caches.open(cacheName).then((cache) => cache.addAll(["/index.html"]))
  );
}

function onActivate(event) {
  event.waitUntil(
    self.caches
      .keys()
      .then((names) => {
        return Promise.all(
          names.map((name) => {
            if (name !== cacheName) {
              return self.caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
}

function onFetch(event) {
  const request = event.request;

  if (request.headers.get("Accept").includes("text/html")) {
    event.respondWith(self.caches.match("/index.html"));
  }
}
