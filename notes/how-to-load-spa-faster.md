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

This feature is used for dead code elimination.
Tree shacking was implimented in many actual bundle tools such as a
[webpack](https://github.com/webpack/webpack) or
[rollup](https://github.com/rollup/rollup).
Since 2 release webpack has [built-in support](https://webpack.js.org/guides/tree-shaking/) for ES2015 modules.

If we have an entry point and imported module with some unused exports, we can reduce bundle size out of the box.

**index.js**:

```js
import {willBundled} from './utils'

willBundled()
```

**utils.js**:

```js
export function willBundled () {
  console.log('Hello')
}

export function willEliminated () {
  console.log('Dead code')
}
```

We see that the second export is declared but not used.
So its will not be in final bundle.

This technique works only for ES2015 modules.
We want eliminate dead code also for packages whose use commonjs exports.
First we can try to automate it with tools such a
[`webpack-common-shake`](https://github.com/indutny/webpack-common-shake) or
[`rollup-plugin-commonjs`](https://github.com/rollup/rollup-plugin-commonjs).

In the second place when using big external libraries, `lodash` for example, we can initially avoid inclusion to bundle.
If we import something as follows, whole `lodash` code will be included:

```js
import {omit} from 'lodash'
```

To reduce library size in bundle, you should import only things you need:

```js
import omit from 'lodash/omit'
```

### Code splitting

This feature is used for split our code into many chunks instead of one bundle.
It allows manage the priority of loading chunks and load their in parallel or lazily.

We can split a code describing many entry points or dynamic imports.
It's more manual and flexible approach.

**webpack.config.js**:

```js
module.exports = {
  entry: {
    loader: './src/index',
    vendor: [
      'react',
      'react-dom'
    ]
  },
  output: {
    filename: '[name].chunk.js',
    chunkFilename: '[name].chunk.js',
    path: `${__dirname}/dist`
  }
}
```

**index.js**:

```js
import React from 'react'
import {render} from 'react-dom'
import checkSession from './checkSession'

async function init () {
  const logined = await checkSession()

  if (!logined) {
    window.location = '/login'
    return
  }

  const {default: App} = await import(/* webpackChunkName: "app" */ './app')

  render(
    <App />,
    document.getElementById('root')
  )
}

init()
```

Building this project will turn three small chunks:

```
dist
|- app.chunk.js
|- loader.chunk.js
|- vendor.chunk.js
```

Splitting also can be implemented automatically using webpack
[`CommonChunkPlugin`](https://webpack.js.org/plugins/commons-chunk-plugin/).

**webpack.config.js**:

```js
const webpack = require('webpack')

module.exports = {
  entry: {
    loader: './src/index',
    user: './src/pages/user',
    dashboard: './src/pages/dashboard'
  },
  output: {
    filename: '[name].chunk.js',
    path: `${__dirname}/dist`
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    })
  ]
}

```

After build this project common code parts will be moved to separate chunk:

```
dist
|- common.chunk.js
|- dashboard.chunk.js
|- loader.chunk.js
|- user.chunk.js
```

### Code deduplication

Code we write sometimes has some [duplicated parts](https://refactoring.guru/smells/duplicate-code) that increase the size of our bundle.
Elements may use common styles.
Functions may have similar logic.

If we detect this, we should extract common parts to higher-order function/class:

* [Higher-order function](http://eloquentjavascript.net/05_higher_order.html)
* [Higher-order component in React](https://reactjs.org/docs/higher-order-components.html)
* [Shared CSS class with common styles](http://www.websiteoptimization.com/speed/tweak/classes/)

These techniques allow us to avoid code duplication and reuse function/style logic.

```js
import React, {Component} from 'react'

class Dashboard extends Component {
  componentDidMount () {
    document.title = 'Dashboard'
  }

  render () {
    return (
      <SomeComponent />
    )
  }
}

class Profile extends Component {
  componentDidMount () {
    document.title = 'Profile'
  }

  render () {
    return (
      <AnotherComponent />
    )
  }
}
```

Some common logic is in the example.
Each of components sets document title in its `componentDidMount` life-cycle method.
Extracting this will turn more reusable code without duplication.

```js
import React, {Component} from 'react'

function withTitle (title) {
  return Decorated => class extends Component {
    componentDidMount () {
      document.title = title
    }

    render () {
      return (
        <Decorated {...this.props} />
      )
    }
  }
}

@withTitle('Dashboard')
class Dashboard extends Component {
  render () {
    return (
      <SomeComponent />
    )
  }
}

@withTitle('Profile')
class Profile extends Component {
  render () {
    return (
      <AnotherComponent />
    )
  }
}
```

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
