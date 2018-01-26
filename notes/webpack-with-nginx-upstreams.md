# Webpack with nginx upstreams

_July 25, 2017_

A simple guide to setup the dev environment using webpack with a nginx server.

Currently I work on project containing a lot of applications. Each of them has
its own structure and development process. And all of these applications
have some requirements for dev enviroment.

1. Strict origin is required for application backend and authorization cookies.

2. Sometimes the development of frontend and backend is parallel. And I need
  possibility of switching between development, test or production backends.

3. I have a lot of related applications and scripts. Each of them does not work
  correctly without other. Some applications may have a hot module replacement
  in development or may be served from production.

4. Some of applications are used in `iframe`. In this case strict origin is
  required to test application in dev mode with parent page from production.

5. I need to use dev mode for few applications sometimes. This is not achived
  by proxy application parts with built-in webpack dev server proxy.

Therefore to start enviroment I will need to create **webpack dev server** for
each of my applications and **nginx server** as a proxy.

## webpack dev server

Create two applications with own [webpack dev server](https://webpack.js.org/configuration/dev-server/) on different ports:

* [login](https://github.com/andrepolischuk/webpack-nginx-example/tree/master/login) — http://awesome.app:3001/
* [profile](https://github.com/andrepolischuk/webpack-nginx-example/tree/master/profile) — http://awesome.app:3002/

Configure [webpack](https://webpack.js.org/configuration/) for each of them.

[login/webpack.config.js](https://github.com/andrepolischuk/webpack-nginx-example/blob/master/login/webpack.config.js):

```js
var webpack = require('webpack')

var config = {
  entry: './index',
  output: {
    filename: 'bundle.js',
    path: __dirname,
    publicPath: '/login/'
  }
}

if (process.env.NODE_ENV !== 'production') {
  config.devServer = {
    inline: true,
    historyApiFallback: true,
    port: 3001,
    host: 'awesome.app'
  }
}

module.exports = config
```

[profile/webpack.config.js](https://github.com/andrepolischuk/webpack-nginx-example/blob/master/profile/webpack.config.js):

```js
var webpack = require('webpack')

var config = {
  entry: './index',
  output: {
    filename: 'bundle.js',
    path: __dirname,
    publicPath: '/profile/'
  }
}

if (process.env.NODE_ENV !== 'production') {
  config.devServer = {
    inline: true,
    historyApiFallback: true,
    port: 3002,
    host: 'awesome.app'
  }
}

module.exports = config
```

## nginx server

Create nginx server on `awesome.app:80` to [proxy](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)
webpack dev server through [upstreams](http://nginx.org/en/docs/http/ngx_http_upstream_module.html)
if it's reachable or proxy production.

[nginx.awesome.conf](https://github.com/andrepolischuk/webpack-nginx-example/blob/master/nginx.awesome.conf):

```
upstream login {
  server awesome.app:80 backup;
  server awesome.app:3001;
}

upstream profile {
  server awesome.app:80 backup;
  server awesome.app:3002;
}

server {
  listen 80;
  server_name awesome.app;
  sendfile off;
  proxy_max_temp_file_size 0;

  location /login {
    proxy_set_header Host      $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://login;
  }

  location /profile {
    proxy_set_header Host      $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://profile;
  }

  location / {
    proxy_set_header Host      $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://awesome.app;
  }
}
```

Append domain into the `hosts` file:

```
0.0.0.0 awesome.app
```

## Summary

Congrats! You have a simple dev enviroment for your projects. Now you just need
to start nginx and webpack dev server for application you want make some magic.

You can find all sources in [example](https://github.com/andrepolischuk/webpack-nginx-example) repo and play with it.
