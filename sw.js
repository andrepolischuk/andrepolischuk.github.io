/* eslint-env serviceworker */
/* global fetch URL */
'use strict'
const cacheVersion = 'v1'

const assetsForCache = [
  './offline.html',
  './index.js',
  './styles.css',
  './images/favicon48.png'
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

  if (event.request.method === 'GET') {
    if (url.origin === self.location.origin && url.pathname === '/') {
      event.respondWith(
        caches
          .open(cacheVersion)
          .then(cache => fetch(event.request)
            .then(networkResponse => {
              cache.put(event.request, networkResponse.clone())
              return networkResponse
            })
            .catch(() => cache.match(event.request)
              .then(cachedResponse => cachedResponse || cache.match('./offline.html'))
            )
          )
      )
    } else {
      event.respondWith(
        caches
          .open(cacheVersion)
          .then(cache => cache.match(event.request)
            .then(cachedResponse => cachedResponse || fetch(event.request)
              .then(networkResponse => {
                cache.put(event.request, networkResponse.clone())
                return networkResponse
              })
            )
            .catch(() => cache.match('./offline.html'))
          )
      )
    }
  }
})
