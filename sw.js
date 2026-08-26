/**
 * sw.js — Service Worker
 * Cachea todas las páginas y sus archivos propios para que la app
 * funcione offline dentro del APK generado por PWABuilder.
 */
const CACHE_NAME = "pergamino-sagrado-v2";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./cartas.html",
  "./cofres.html",
  "./equipo.html",
  "./mundo.html",
  "./preguntas.html",
  "./manifest.json",

  "./css/base.css",
  "./css/home.css",
  "./css/cards.css",
  "./css/chests.css",
  "./css/team.css",
  "./css/world.css",
  "./css/quiz.css",

  "./js/data/cards.js",
  "./js/data/synergies.js",
  "./js/data/worlds.js",
  "./js/data/quiz-questions.js",
  "./js/core/state.js",
  "./js/core/gacha.js",
  "./js/core/cardModal.js",
  "./js/home.js",
  "./js/cards.js",
  "./js/chests.js",
  "./js/team.js",
  "./js/world.js",
  "./js/quiz.js",

  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match("./index.html")))
  );
});
