/* eslint-env serviceworker */
/* global fetch URL */
'use strict'
const cacheVersion = 'v1'

const assetsForCache = [
  './offline.html',
  './index.js',
  './styles.css'
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
        update(event.request)
          .catch(() => fromCache(event.request)
            .then(response => response || fromCache('./offline.html'))
          )
      )
    } else {
      event.respondWith(
        fromCache(event.request)
          .then(response => response || update(event.request)
            .catch(() => fromCache('./offline.html'))
          )
      )

      event.waitUntil(
        fromCache(event.request)
          .then(response => response && update(event.request))
      )
    }
  }
})

function fromCache (request) {
  return caches
    .open(cacheVersion)
    .then(cache => cache.match(request))
}

function update (request) {
  return caches
    .open(cacheVersion)
    .then(cache => fetch(request)
      .then(response => {
        cache.put(request, response.clone())
        return response
      })
    )
}
