/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";

// Добавляем fallback на случай отсутствия манифеста
const manifest = self.__WB_MANIFEST || [
  { url: "/index.html", revision: "1" },
  { url: "/manifest.json", revision: "1" },
  // Добавьте другие критические файлы
];

precacheAndRoute(manifest);

self.addEventListener("install", () => {
  self.skipWaiting();
  console.log("Service Worker installed");
});

self.addEventListener("activate", () => {
  console.log("Service Worker activated");
});
