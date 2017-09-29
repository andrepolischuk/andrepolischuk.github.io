# How to load SPA faster

<!-- _October 1, 2017_ -->

We work on apps with a lot of JavaScript code, styles, icons.
We have the endless process of adding new features, pages, elements everyday.
Gradually we have a problem that size and loading time of the our compiled code increases.

It seems that present frontend development has some challenges for us.
Many use low-end smartphones to work with our apps.
Much code with business logic is located on client instead of backend,
but many of us don't think about the optimal use/ship of resouces.
Our apps have a enormous trees of external dependencies
whose authors also don't think about size of their packages.

Use of modern techniques help us to ship smaller bundles to browsers.

## What can we do?

### Tree-shaking

Use auto/hand tree-shaking to drop unused parts of modules

### Code-spliting

Split into asyncronous chunks

### Code deduplication

Avoid code duplication, especially styles

### Images without base64

Avoid base64 images to better gzip compression

### Caching

Cache chunks by request with hashes `bundle.js?[chunkhash]`
Separate own modules and vendor, lock their versions

### Lazy fetching

Request only required data at start and lazily load rest

## Summary

That's all.
If you have an slow app with a big resources for shipping,
try to apply those techniques to your bundling process.
Think about loading performance at every turn.
Research what you can do to reduce the loading time more.
