'use strict'

function onHashChange () {
  const {hash} = window.location
  const anchor = document.querySelector(`a[href="${decodeURIComponent(hash)}"]`)
  if (anchor) {
    anchor.scrollIntoView()
  }
}

window.addEventListener('hashchange', onHashChange)
document.addEventListener('DOMContentLoaded', onHashChange)
onHashChange()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
