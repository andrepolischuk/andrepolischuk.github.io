# How to load SPA faster

<!-- _October 1, 2017_ -->

We work on apps with a lot of JavaScript code, styles, icons.
We have the endless process of adding new features, pages, elements everyday.
Gradually we have a problem that size and loading time of the our compiled code increases.

It seems that present frontend development has some challenges for us.
Many use low-end smartphones to work with our apps.
Much code with business logic is located on client instead of backend.
Many of us don't think about the optimal use/ship of resouces.
Our apps have a enormous trees of external dependencies whose authors also don't think about size of their packages.

Use of modern techniques help us to ship smaller bundles to browsers.

## What can we do?

### Tree shaking

It's a feature used for dead code elimination.
Tree shacking was implimented in many actual bundle tools such as a
[webpack](https://github.com/webpack/webpack) or
[rollup](https://github.com/rollup/rollup).
Since 2 release webpack has [built-in support](https://webpack.js.org/guides/tree-shaking/) for ES2015 modules.

For example we have a entry point and imported module having a few exports.

index.js:

```js
import {willBundled} from './utils'

willBundled()
```

utils.js:

```js
export function willBundled () {
  return 1
}

export function willEliminated () {
  return 0
}
```

We see that the second export is declared but not used.
So its will not be in final bundle.

This technique works only for ES2015 modules.
We want eliminate dead code also for packages whose use commonjs exports.
First we can try to automate it with tools such a
[webpack-common-shake](https://github.com/indutny/webpack-common-shake) or
[rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs).

In the second place when using big external libraries, _lodash_ for example, we can initially avoid inclusion to bundle.
If we import something as follows, whole lodash will be included:

```js
import {omit} from 'lodash'
```

To reduce library size in bundle, you should import only things you need:

```js
import omit from 'lodash/omit'
```

Tree shacking helps us reduce bundle size in most cases out of the box.

### Code spliting

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
If you have a slow app with a big bundle for shipping, try to apply those techniques to your compiling process.
Think about loading performance at every turn and research what you can do to reduce the loading time more.
