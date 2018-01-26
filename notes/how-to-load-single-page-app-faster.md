# How to load single-page app faster

_October 3, 2017_

Yet another research about ways to slightly reduce size and loading time of the frontend applications.

We work on apps with a lot of JavaScript code, styles.
We have the endless process of adding new features, pages, elements everyday.
Gradually we have a problem when size and loading time of the our bundled code increases.

It seems like present frontend development has some challenges for us.
Many users work with our apps using low-end smartphones.
Much code with business logic is located on client instead of backend.

Herewith many of us don't think about the optimal use/ship of resouces.
Our apps have an enormous trees of external dependencies whose authors also don't think about size of their packages.

## What can we do?

Use of the following modern techniques will help us to ship smaller bundles to browsers.

### Tree shaking

This feature is used for dead code elimination.
Tree shacking was implimented in many actual bundle tools like
[webpack](https://webpack.js.org/guides/tree-shaking/) or
[rollup](https://rollupjs.org/#tree-shaking) for ES2015 modules.

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
First we can try to automate it with plugins such a
[`webpack-common-shake`](https://github.com/indutny/webpack-common-shake) or
[`rollup-plugin-commonjs`](https://github.com/rollup/rollup-plugin-commonjs).

In the second place when using big external libraries, `lodash` for example, we can initially avoid inclusion to bundle.
If we import something as follows, whole `lodash` code will be included:

```js
import {omit} from 'lodash'
```

It happens because libraries were preliminarily transpiled to ES5 syntax with `require` imports.
To reduce the import of such libraries, you should request only things you need:

```js
import omit from 'lodash/omit'
```

### Code splitting

This feature is used for split our code into many chunks instead of one bundle.
It allows manage the priority of loading chunks and load their in parallel or lazily.
Code splitting is currently [supported by webpack](https://webpack.js.org/guides/code-splitting/), but isn't still implemented in rollup.

We can split a code describing many entry points or dynamic imports.

**webpack.config.js**:

```js
module.exports = {
  entry: {
    loader: './index',
    check: './check'
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
import check from './check'

async function init () {
  const logined = await check()

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
|- check.chunk.js
|- loader.chunk.js
```

Splitting also can be implemented automatically using webpack
[`CommonChunkPlugin`](https://webpack.js.org/plugins/commons-chunk-plugin/).

**webpack.config.js**:

```js
const webpack = require('webpack')

module.exports = {
  entry: {
    app: './index',
    user: './pages/user',
    dashboard: './pages/dashboard'
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

After building this project common code parts will be moved to separate chunk:

```
dist
|- app.chunk.js
|- common.chunk.js
|- dashboard.chunk.js
|- user.chunk.js
```

Splitting code can also be produced by the other plugins:

* [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)—split CSS by extracting text from bundle into a file
* [bundle-loader](https://github.com/webpack-contrib/bundle-loader)—split code and lazy load resulting bundles

### Common code extracting

Code we are writing sometimes has some [duplicated parts](https://refactoring.guru/smells/duplicate-code) that increase the size of our bundle.
Elements may use common styles.
Functions may have similar logic.

If we detect this, we should extract common parts to higher-order function/class:

* [Higher-order function](http://eloquentjavascript.net/05_higher_order.html)
* [Higher-order component in React](https://reactjs.org/docs/higher-order-components.html)
* [Shared CSS class with common styles](http://www.websiteoptimization.com/speed/tweak/classes/)

These techniques allow us avoid code duplication and reuse function/style logic.

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

### Caching

After reducing the size of our bundle, we should directly think about loading it with browser.
If we have single bundle, user browser will be forced to load it again after each code change.
To avoid this, we can use browser technique called caching.
Browser caching allows you speed up loading recources by saving files locally.

We laid a good basis to cache our code applying the tree shaking, splitting and extracting.
After splitting, we have few small chunks.
Each of them can be cached.
With tools like webpack, we can easy [configure caching](https://webpack.js.org/guides/caching/).

**webpack.config.js**:

```js
module.exports = {
  entry: {
    app: './index',
    utils: './utils'
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: `${__dirname}/dist`
  }
}
```

Building this project will get chunks with chunk-specific hashes in filenames:

```
dist
|- app.e2a5ac13d7b26742f4d7.js
|- utils.e646121558170aeedd91.js
```

Now when we modify code in one module, building this project update only one chunk containing this module with new hash.
User browser will have to load again only this updated chunk.
Other ones will be taken from browser cache.

One more thing we can apply to build is a manual extracting vendor modules and lock their versions.
External libraries are updated us less often than own code.
So we should minimize the force loading of a chunk containing this libraries.

**webpack.config.js**:

```js
const webpack = require('webpack')

module.exports = {
  entry: {
    app: './index',
    utils: './utils',
    vendor: [
      'react',
      'react-dom'
    ]
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: `${__dirname}/dist`
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    })
  ]
}
```

Building with this config will make the following output:

```
dist
|- app.e2a5ac13d7b26742f4d7.js
|- utils.e646121558170aeedd91.js
|- vendor.95dc51f578ab5785150a.js
```

### Wrapping up

That's all.
We've learned few useful methods to speed up loading of our resources.
If you have a slow loaded app with a big bundle for shipping, try to apply all those techniques to your building process.

Research what you can do to reduce the loading time more.
Here are some other approaches to help you optimize this more:

* [Preload: What Is It Good For?](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/)
* [Inlining critical CSS for better web performance](https://gomakethings.com/inlining-critical-css-for-better-web-performance/)
* [The Benefits of Server Side Rendering Over Client Side Rendering](https://medium.com/walmartlabs/the-benefits-of-server-side-rendering-over-client-side-rendering-5d07ff2cefe8)

Think about loading performance at every turn.
