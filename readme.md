# koa-views

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]

Template rendering middleware for koa.

## Installation

```
$ npm install koa-views
```

## Templating engines

As of right now, `koa-views` is using [consolidate](https://github.com/tj/consolidate.js) under the hood.

[List of supported engines](https://github.com/tj/consolidate.js#supported-template-engines)

## Example (koa 1.x)

```js
var views = require('koa-views');

// Must be used before any router is used
app.use(views(__dirname + '/views', {
  map: {
    html: 'underscore'
  }
}));

app.use(function* (next) {
  this.state = {
    session: this.session,
    title: 'app'
  };

  yield this.render('user', {
    user: 'John'
  });
});
```

## Example (koa 2.x)

This module won't get converted to koa 2 until v8 lands `async-await`. If you want to use koa 2 you need to wrap this module with [koa-convert](https://github.com/koajs/convert) and build your code with [babel 6](https://babeljs.io/). View this [issue](https://github.com/queckezz/koa-views/issues/41) if you run into problems.

```js
app.use(convert(views(__dirname, {
  map: {
    html: 'nunjucks'
  }
})))

app.use(async (ctx, next) => {
  ctx.render = co.wrap(ctx.render)
  await next()
})

app.use(async (ctx, next) => {
  yield this.render('./views/user.html')
})
```

For more examples take a look at the [tests](./test/index.js)

## API

#### `views(root, opts)`

* `root`: Where your views are located. All views you `render()` are relative to this path.
* `opts` (optional)
* `opts.extension`: Default extension for your views

```js
// instead of this
yield this.render('user.jade')
// you can
yield this.render('user')
```

* `opts.map`: map extension to an engine

```js
app.use(views(__dirname, { map: {html: 'nunjucks' }}))

// render `user.html` with nunjucks
app.use(function *() {
  yield this.render('user.html')
})
```

## Debug

Set the `DEBUG` environment variable to `koa-views` when starting your server.

```bash
$ DEBUG=koa-views
```

## License

[MIT](./license)

[travis-image]: https://img.shields.io/travis/queckezz/koa-views.svg?style=flat-square
[travis-url]: https://travis-ci.org/queckezz/koa-views
[npm-image]: https://img.shields.io/npm/v/koa-views.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-views
[david-image]: http://img.shields.io/david/queckezz/koa-views.svg?style=flat-square
[david-url]: https://david-dm.org/queckezz/koa-views
[license-image]: http://img.shields.io/npm/l/koa-views.svg?style=flat-square
[license-url]: ./license
