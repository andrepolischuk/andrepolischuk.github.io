/* eslint-env serviceworker */
/* global fetch URL */
'use strict'
const cacheVersion = 'v1'

const assetsForCache = [
  './index.js',
  './styles.css',
  './favicon.png'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(cacheVersion)
      .then(cache => cache.addAll(assetsForCache))
  )
})

self.addEventListener('activate', event => {
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  if (url.origin === self.location.origin && url.pathname === '/') {
    event.respondWith(
      caches
        .open(cacheVersion)
        .then(
          cache => fetch(event.request)
            .then(response => {
              cache.put(event.request, response.clone())
              return response
            })
            .catch(() => cache.match(event.request))
        )
    )
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then(response => response || fetch(event.request))
    )
  }
})
