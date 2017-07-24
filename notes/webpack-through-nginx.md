# Webpack through nginx

In my work I have some requirements for dev enviroment.

Backend for our applications and authorization cookies require a strict origin.

We develop frontend and backend in parallel sometimes
and need be able switch to development, test or production backend.

We have a lot of related projects and applications.
Each of them don't work correctly without other,
and should have a hot module replacement in development or should be serve from production.

Therefore I use nginx as a proxy for webpack dev server.

For example we have two applications on `awesome.app` with own webpack dev server on different ports.

* [login](https://github.com/andrepolischuk/webpack-through-nginx-example/tree/master/login) — http://localhost:3001/
* [profile](https://github.com/andrepolischuk/webpack-through-nginx-example/tree/master/profile) — http://localhost:3002/

**Configure `webpack-dev-server`.**

[login/webpack.config.js](https://github.com/andrepolischuk/webpack-through-nginx-example/blob/master/login/webpack.config.js):

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
    disableHostCheck: true
  }
}

module.exports = config
```

[profile/webpack.config.js](https://github.com/andrepolischuk/webpack-through-nginx-example/blob/master/profile/webpack.config.js):

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
    disableHostCheck: true
  }
}

module.exports = config
```

**Create nginx server** on `80` for proxy webpack dev server through upstreams if enable or proxy production.

[nginx.awesome.conf](https://github.com/andrepolischuk/webpack-through-nginx-example/blob/master/nginx.awesome.conf):

```
upstream login {
  server awesome.app:80 backup;
  server localhost:3001;
}

upstream profile {
  server awesome.app:80 backup;
  server localhost:3002;
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

**Append your host** into the `hosts` file:

```
0.0.0.0 awesome.app
```

Congrats! You have a simple and beautiful dev enviroment for your projects.
Now you only need to start nginx and webpack dev server for application you want make some magic.

You can find all sources in [example](https://github.com/andrepolischuk/webpack-through-nginx-example) repo and play with it.
